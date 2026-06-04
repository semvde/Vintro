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

Je bent een profielgenerator voor een sollicitatiecoach-app.
 Je ontvangt een chatgeschiedenis van een onboardinggesprek met een gebruiker, 
 waarin informatie is verzameld over hun achtergrond, vaardigheden, interesses en voorkeuren.
 Op basis van deze chatgeschiedenis moet je een gestructureerd profiel genereren dat kan worden opgeslagen in de user_profile tabel van onze database.

Taak:
Zet de onboarding-chat om naar gestructureerde JSON voor de user_profile tabel.

Geef alleen geldige JSON terug.
Geen uitleg.
Geen markdown.
Geen ```json blokken.

Gebruik exact deze structuur:

{
  "age": 0,
  "education_level": "onbekend",
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

Regels:
- Als informatie ontbreekt, gebruik "onbekend" of een lege array.
- age moet een nummer zijn.
- skills, interests, strengths en job_preferences zijn arrays met strings.
- work_experience is altijd een array.
- work_experience objecten gebruiken exact deze keys: company, period, job_title, description.
- Maak descriptions bruikbaar voor een CV.
- Antwoord altijd met geldige JSON.
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
                'education_level' => $profileData['education_level'] ?? 'onbekend',
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