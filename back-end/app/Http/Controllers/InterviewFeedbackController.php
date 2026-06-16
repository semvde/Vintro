<?php

namespace App\Http\Controllers;

use App\Models\InterviewFeedback;

class InterviewFeedbackController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $feedbacks = InterviewFeedback::with(['interview.vacancy'])
            ->whereHas('interview.vacancy', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'interview_id' => $feedback->interview_id,
                    'ai_feedback' => json_decode($feedback->ai_feedback, true),
                    'accepted' => $feedback->accepted,
                    'created_at' => $feedback->created_at,
                    'interview' => $feedback->interview ? [
                        'id' => $feedback->interview->id,
                        'vacancy_id' => $feedback->interview->vacancy_id,
                        'vacancy' => $feedback->interview->vacancy ? [
                            'id' => $feedback->interview->vacancy->id,
                            'title' => $feedback->interview->vacancy->title,
                            'company' => $feedback->interview->vacancy->company,
                            'location' => $feedback->interview->vacancy->location,
                            'employment_type' => $feedback->interview->vacancy->employment_type,
                            'salary' => $feedback->interview->vacancy->salary,
                            'description' => $feedback->interview->vacancy->description,
                        ] : null,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $feedbacks,
        ]);
    }

    public function show($vacancyId)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $feedback = InterviewFeedback::whereHas('interview.vacancy', function ($query) use ($user, $vacancyId) {
            $query->where('user_id', $user->id)
                ->where('id', $vacancyId);
        })
            ->with(['interview.vacancy'])
            ->first();

        if (!$feedback) {
            return response()->json([
                'message' => 'Interview feedback not found'
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $feedback->id,
                'interview_id' => $feedback->interview_id,
                'ai_feedback' => json_decode($feedback->ai_feedback, true),
                'accepted' => $feedback->accepted,
                'created_at' => $feedback->created_at,
                'interview' => $feedback->interview,
            ],
        ]);
    }
}
