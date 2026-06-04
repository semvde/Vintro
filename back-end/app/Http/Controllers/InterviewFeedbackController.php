<?php

namespace App\Http\Controllers;

use App\Models\InterviewFeedback;

class InterviewFeedbackController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        $feedback = \App\Models\InterviewFeedback::whereHas('interview.vacancy', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with('interview')
            ->get();

        return response()->json([
            'data' => $feedback
        ]);
    }

    public function show($id)
    {
        $user = auth('api')->user();

        $feedback = InterviewFeedback::where('id', $id)
            ->whereHas('interview.vacancy', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('interview')
            ->first();

        if (!$feedback) {
            return response()->json([
                'message' => 'Interview feedback not found'
            ], 404);
        }

        return response()->json([
            'data' => $feedback
        ]);
    }
}
