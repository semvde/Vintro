<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;
use App\Models\UserProfile;
use App\Services\QwenService;

class VacancyController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $vacancies = Vacancy::where('user_id', $user->id)->get();

        return response()->json([
            'data' => $vacancies
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $vacancy = Vacancy::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$vacancy) {
            return response()->json([
                'message' => 'Vacancy not found'
            ], 404);
        }

        return response()->json([
            'data' => $vacancy
        ]);
    }

    public function generateFakeVacancies(Request $request, QwenService $qwen)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $profile = UserProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Geen profiel gevonden.'
            ], 404);
        }

        $profilePayload = [
            'age' => $profile->age,
            'skills' => $profile->skills ?? [],
            'strengths' => $profile->strengths ?? [],
            'job_preferences' => $profile->job_preferences ?? [],
            'interests' => $profile->interests ?? [],
            'profile_summary' => $profile->profile_summary ?? '',
            'education_level' => $profile->education_level ?? [],
            'work_experience' => $profile->work_experience ?? [],
        ];

        $systemPrompt = <<<'PROMPT'
You are a vacancy generator for VINTRO. Your goal is to generate accessible, low-barrier job vacancies
for people who are re-entering the workforce, have limited experience, or are looking for entry-level opportunities.
 
Generate exactly 15 fake but realistic vacancies based on the given user profile.
Use the user's skills, job preferences, strengths, and summary to loosely match jobs — but always keep them accessible.
 
Return only valid JSON in this exact structure:
{
  "vacancies": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "employment_type": "part-time|full-time|contract|internship|temporary",
      "salary": 0,
      "description": "string"
    }
  ]
}
 
Rules:
- Return exactly 15 items.
- All vacancies must be LOW-BARRIER and ENTRY-LEVEL:
  - No degree or diploma required (at most MBO level 2).
  - No prior work experience required — willingness to learn is enough.
  - Prefer part-time, flexible hours, or temporary contracts where possible.
  - Salary must be realistic for entry-level work in the Netherlands (between 500 and 2200 per month).
  - Descriptions must be encouraging, friendly, and welcoming — not intimidating.
  - Avoid corporate jargon; write in plain, simple language.
- Include a mix of sectors: retail, hospitality, logistics, cleaning, care, administration, delivery, supermarket, etc.
- Each description must include:
  - What the job involves (2-3 sentences, simple language).
  - Why it suits someone without much experience ("You don't need experience — we'll train you!").
  - 1 or 2 soft skills or personal traits that are welcome (e.g. reliable, punctual, friendly).
- Do not add markdown, code fences, or explanations.
- Do not return anything except JSON.
PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
            [
                'role' => 'user',
                'content' => json_encode($profilePayload, JSON_UNESCAPED_UNICODE),
            ],
        ];

        try {
            $content = $qwen->chat($messages, 1800, 0.3);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'AI request failed',
                'details' => json_decode($e->getMessage(), true) ?? $e->getMessage(),
            ], 500);
        }

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

        $vacancyList = $data['vacancies'] ?? [];

        if (!is_array($vacancyList) || count($vacancyList) !== 15) {
            return response()->json([
                'message' => 'AI gaf niet precies 15 vacatures terug.',
                'raw' => $data,
            ], 500);
        }

        $vacancies = [];

        foreach ($vacancyList as $vacancy) {
            if (
                !isset(
                $vacancy['title'],
                $vacancy['company'],
                $vacancy['location'],
                $vacancy['employment_type'],
                $vacancy['salary'],
                $vacancy['description']
            )
            ) {
                continue;
            }

            $vacancies[] = [
                'user_id' => $user->id,
                'title' => $vacancy['title'],
                'company' => $vacancy['company'],
                'location' => $vacancy['location'],
                'employment_type' => $vacancy['employment_type'],
                'salary' => $vacancy['salary'],
                'description' => $vacancy['description'],
            ];
        }

        if (count($vacancies) !== 15) {
            return response()->json([
                'message' => 'AI output bevat onvolledige vacatures.',
                'raw' => $data,
            ], 500);
        }

        $created = $user->vacancies()->createMany($vacancies);

        return response()->json([
            'message' => '15 oefenvacatures aangemaakt.',
            'count' => count($created),
            'data' => $created,
        ]);
    }
}