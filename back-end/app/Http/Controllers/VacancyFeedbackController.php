<?php

namespace App\Http\Controllers;

use App\Models\VacancyFeedback;

class VacancyFeedbackController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        $feedback = VacancyFeedback::whereHas('vacancy', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with('vacancy')
            ->get();

        return response()->json([
            'data' => $feedback
        ]);
    }

    public function show($id)
    {
        $user = auth('api')->user();

        $feedback = VacancyFeedback::where('id', $id)
            ->whereHas('vacancy', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('vacancy')
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
