<?php

namespace App\Http\Controllers;

use App\Models\OnboardingSession;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProfileGenerationController extends Controller
{
    public function generate(Request $request)
    {
        $user = auth('api')->user();

        $session = OnboardingSession::where('user_id', $user->id)
            ->where('completed', true)
            ->latest()
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Geen afgeronde onboarding gevonden.'
            ], 404);
        }

        $chatHistory = $session->chat_history ?? [];

        $systemPrompt = <<<'PROMPT'
/no_think

/no_think

Je bent een profielgenerator voor VINTRO, een sollicitatiecoach-app.

Je ontvangt een chatgeschiedenis van een onboardinggesprek.
Zet deze chatgeschiedenis om naar gestructureerde JSON voor de user_profile tabel.

Doel van het profiel:
- een eerste CV kunnen genereren;
- passende oefenvacatures kunnen maken;
- sollicitatiegesprekken persoonlijker kunnen oefenen.

Geef alleen geldige JSON terug.
Geen uitleg.
Geen markdown.
Geen ```json blokken.
Verzin geen feiten.
Gebruik alleen informatie uit de chatgeschiedenis.
Als informatie ontbreekt, gebruik "onbekend" of een lege array.

Gebruik exact deze structuur:

{
  "age": 0,
  "education_level": {
    "degree": "onbekend",
    "school": "onbekend",
    "status": "onbekend",
    "period": "onbekend"
  },
  "skills": [],
  "work_experience": [
    {
      "company": "onbekend",
      "period": "onbekend",
      "job_title": "onbekend",
      "description": "onbekend"
    }
  ],
  "interests": [],
  "strengths": [],
  "job_preferences": [],
  "profile_summary": "korte samenvatting"
}

Veldregels:
- age moet een nummer zijn. Als leeftijd onbekend is, gebruik 0.
- education_level.degree is bijvoorbeeld "HAVO", "VMBO", "MBO", "HBO", "WO" of "onbekend".
- education_level.school is de schoolnaam als die genoemd is, anders "onbekend".
- education_level.status is bijvoorbeeld "afgerond", "gestopt", "bezig" of "onbekend".
- education_level.period is de periode als die genoemd is, anders "onbekend".
- skills is een array met concrete vaardigheden.
- interests is een array met interesses/hobby's.
- strengths is een array met persoonlijke sterke punten.
- job_preferences is een array met soorten werk of werkrichtingen die passen bij de gebruiker.
- work_experience is altijd een array.
- work_experience objecten gebruiken exact deze keys: company, period, job_title, description.
- Maak work_experience.description bruikbaar voor een CV, maar verzin geen taken die niet logisch volgen uit de chat.
- profile_summary is 2 tot 4 zinnen in het Nederlands en geschikt als basis voor een profieltekst.

Normalisatie:
- Zet opleidingsnamen netjes in hoofdletters waar logisch, bijvoorbeeld "havo" wordt "HAVO".
- Als de gebruiker "vakkenvuller bij Jumbo" noemt, maak company "Jumbo" en job_title "Vakkenvuller".
- Als periode ontbreekt, gebruik "onbekend".
- Als er geen werkervaring is, gebruik een lege array voor work_experience.
- Gebruik geen null.

PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
            [
                'role' => 'user',
                'content' => json_encode($chatHistory, JSON_UNESCAPED_UNICODE),
            ],
        ];

        $response = Http::withToken(env('HF_TOKEN'))
            ->timeout(120)
            ->post('https://router.huggingface.co/v1/chat/completions', [
                'model' => env('HF_MODEL'),
                'messages' => $messages,
                'temperature' => 0.2,
                'max_tokens' => 700,
                'stream' => false,
                'chat_template_kwargs' => [
                    'enable_thinking' => false,
                ],
            ]);

        if ($response->failed()) {
            return response()->json([
                'error' => 'Profile generation failed',
                'status' => $response->status(),
                'details' => $response->json() ?? $response->body(),
            ], $response->status());
        }

        $content = $response->json('choices.0.message.content')
            ?? $response->json('choices.0.message.reasoning_content')
            ?? null;

        if (!$content) {
            return response()->json([
                'message' => 'Geen AI-output ontvangen.'
            ], 500);
        }

        $profileData = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'AI gaf geen geldige JSON terug.',
                'raw' => $content,
            ], 500);
        }

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'age' => $profileData['age'] ?? null,
                'education_level' => $profileData['education_level'] ?? [
                    'degree' => 'onbekend',
                    'school' => 'onbekend',
                    'status' => 'onbekend',
                    'period' => 'onbekend',
                ],
                'preferred_language' => 'nl',
                'skills' => $profileData['skills'] ?? [],
                'work_experience' => $profileData['work_experience'] ?? [],
                'interests' => $profileData['interests'] ?? [],
                'strengths' => $profileData['strengths'] ?? [],
                'job_preferences' => $profileData['job_preferences'] ?? [],
                'profile_summary' => $profileData['profile_summary'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Profiel gegenereerd.',
            'profile' => $profile,
            'next_action' => 'generate_cv',
        ]);
    }
}