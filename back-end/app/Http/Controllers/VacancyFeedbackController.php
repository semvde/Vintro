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

        Je beoordeelt een motivatiebrief voor een specifieke vacature.

        Je krijgt drie bronnen:
        1. De vacature.
        2. Het user_profile. Dit is informatie die uit onboarding/CV komt.
        3. De motivatiebrief die de gebruiker zelf heeft geschreven.

        Belangrijk:
        - Beoordeel bij good_points en improvement_points alleen de motivatiebrief zelf.
        - Gebruik user_profile niet alsof het al in de brief staat.
        - Als informatie uit user_profile nuttig is, zet dit alleen bij profile_suggestions.
        - Formuleer profielsuggesties duidelijk als: "Uit je profiel/CV blijkt dat ..., dit kun je nog toevoegen aan je brief."
        - Zeg niet dat iets goed in de brief staat als het alleen in user_profile staat.
        - Verzin geen ervaring, opleiding of vaardigheden.

        Geef feedback alsof je direct tegen de gebruiker praat.
        Wees vriendelijk, eerlijk, concreet en praktisch.

        Return alleen geldige JSON in deze exacte structuur:
        {
        "accepted": false,
        "feedback": {
            "reaction": "korte reactie op de brief",
            "good_points": ["wat gaat goed in de motivatiebrief zelf"],
            "improvement_points": ["wat kan beter aan de motivatiebrief zelf"],
            "profile_suggestions": ["welke relevante info uit profiel/CV kan de gebruiker toevoegen"],
            "improved_example": "korte verbeterde voorbeeldversie"
        }
        }

        Regels:
        - accepted is true als de brief zelf goed genoeg is om te versturen.
        - accepted is false als de brief zelf duidelijke verbeterpunten heeft.
        - Een brief mag worden afgekeurd als hij te informeel, te kort of onprofessioneel is.
        - improved_example mag relevante informatie uit user_profile gebruiken, maar alleen als die logisch past.
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

    public function showById($id)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $feedback = VacancyFeedback::with('vacancy')
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$feedback) {
            return response()->json([
                'message' => 'Feedback niet gevonden.'
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $feedback->id,
                'vacancy_id' => $feedback->vacancy_id,
                'motivation_letter' => $feedback->motivation_letter,
                'ai_feedback' => json_decode($feedback->ai_feedback, true),
                'accepted' => $feedback->accepted,
                'created_at' => $feedback->created_at,
                'vacancy' => [
                    'id' => $feedback->vacancy->id,
                    'title' => $feedback->vacancy->title,
                    'company' => $feedback->vacancy->company,
                    'location' => $feedback->vacancy->location,
                ]
            ]
        ]);
    }

    public function index()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $feedbacks = VacancyFeedback::with('vacancy')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'vacancy_id' => $feedback->vacancy_id,
                    'motivation_letter' => $feedback->motivation_letter,
                    'ai_feedback' => json_decode($feedback->ai_feedback, true),
                    'accepted' => $feedback->accepted,
                    'created_at' => $feedback->created_at,
                    'vacancy' => $feedback->vacancy ? [
                        'id' => $feedback->vacancy->id,
                        'title' => $feedback->vacancy->title,
                        'company' => $feedback->vacancy->company,
                        'location' => $feedback->vacancy->location,
                        'employment_type' => $feedback->vacancy->employment_type,
                        'salary' => $feedback->vacancy->salary,
                        'description' => $feedback->vacancy->description,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $feedbacks,
        ]);
    }
}