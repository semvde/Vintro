<?php

namespace App\Http\Controllers;

use App\Models\VacancyFeedback;

class VacancyFeedbackController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        $feedbacks = VacancyFeedback::where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $feedbacks
        ]);
    }

    public function show($id)
    {
        $user = auth('api')->user();

        $feedback = VacancyFeedback::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$feedback) {
            return response()->json([
                'message' => 'Vacancy feedback not found'
            ], 404);
        }

        return response()->json([
            'data' => $feedback
        ]);
    }
}
