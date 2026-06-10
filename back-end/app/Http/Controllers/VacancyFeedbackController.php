<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use App\Models\Vacancy;
use App\Models\VacancyFeedback;
use App\Services\QwenService;
use Illuminate\Http\Request;

class VacancyFeedbackController extends Controller
{
    public function store(Request $request, QwenService $qwen)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'vacancy_id' => ['required', 'integer', 'exists:vacancies,id'],
            'motivation_letter' => ['required', 'string', 'min:30'],
        ]);

        $vacancy = Vacancy::where('id', $validated['vacancy_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$vacancy) {
            return response()->json(['message' => 'Vacature niet gevonden.'], 404);
        }

        $profile = UserProfile::where('user_id', $user->id)->first();

        $payload = [
            'vacancy' => $vacancy,
            'user_profile' => $profile,
            'motivation_letter' => $validated['motivation_letter'],
        ];

        $systemPrompt = <<<'PROMPT'
Je bent Victoria, een sollicitatiecoach voor jongeren.

Je beoordeelt een motivatiebrief voor een vacature.
Gebruik de vacature, het profiel van de gebruiker en de motivatiebrief.

Geef feedback alsof je direct tegen de gebruiker praat.
Wees vriendelijk, eerlijk, concreet en praktisch.

Return alleen geldige JSON in deze exacte structuur:
{
  "accepted": false,
  "feedback": {
    "reaction": "korte reactie op de brief",
    "good_points": ["wat gaat goed"],
    "improvement_points": ["wat kan beter"],
    "improved_example": "korte verbeterde voorbeeldversie"
  }
}

Regels:
- accepted is true als de brief goed genoeg is om te versturen.
- accepted is false als er duidelijke verbeterpunten zijn.
- Verzin geen ervaring, opleiding of vaardigheden.
- Geen markdown.
- Geen uitleg buiten JSON.
PROMPT;

        try {
            $content = $qwen->chat([
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => json_encode($payload, JSON_UNESCAPED_UNICODE)],
            ], 1200, 0.2);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI request failed',
                'details' => json_decode($e->getMessage(), true) ?? $e->getMessage(),
            ], 500);
        }
        dd($content);

        $content = trim($content);
        $content = preg_replace('/^```json\s*/i', '', $content);
        $content = preg_replace('/^```\s*/', '', $content);
        $content = preg_replace('/\s*```$/', '', $content);

        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'AI gaf geen geldige JSON terug.',
                'raw' => $content,
            ], 500);
        }

        $feedback = VacancyFeedback::updateOrCreate(
            [
                'user_id' => $user->id,
                'vacancy_id' => $vacancy->id,
            ],
            [
                'motivation_letter' => $validated['motivation_letter'],
                'ai_feedback' => json_encode($data['feedback'] ?? [], JSON_UNESCAPED_UNICODE),
                'accepted' => (bool) ($data['accepted'] ?? false),
            ]
        );

        return response()->json([
            'message' => 'Motivatiebrief opgeslagen en feedback gegenereerd.',
            'data' => [
                'id' => $feedback->id,
                'vacancy_id' => $feedback->vacancy_id,
                'motivation_letter' => $feedback->motivation_letter,
                'ai_feedback' => json_decode($feedback->ai_feedback, true),
                'accepted' => $feedback->accepted,
            ],
        ]);
    }

    public function show($vacancyId)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $feedback = VacancyFeedback::where('user_id', $user->id)
            ->where('vacancy_id', $vacancyId)
            ->latest()
            ->first();

        if (!$feedback) {
            return response()->json([
                'message' => 'Nog geen feedback gevonden voor deze vacature.'
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $feedback->id,
                'vacancy_id' => $feedback->vacancy_id,
                'motivation_letter' => $feedback->motivation_letter,
                'ai_feedback' => json_decode($feedback->ai_feedback, true),
                'accepted' => $feedback->accepted,
            ],
        ]);
    }
}