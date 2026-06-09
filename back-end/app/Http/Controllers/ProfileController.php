<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = auth('api')->user();

        $user->load(['profile', 'cv']);

        return response()->json([
            'data' => [
                'profile' => $user->profile,
                'cv' => $user->cv,
            ],
        ]);
    }

    public function update(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = auth('api')->user();

        $request->validate([
            'name' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'skills' => ['nullable', 'array'],
            'work_experience' => ['nullable', 'array'],
            'education_level' => ['nullable', 'array'],
            'preferred_language' => ['nullable', 'string'],

            'phone_number' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
        ]);

        if ($request->hasAny([
            'name', 'image', 'skills', 'work_experience', 'education_level', 'preferred_language'
        ])) {
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                $request->only([
                    'name',
                    'image',
                    'skills',
                    'work_experience',
                    'education_level',
                    'preferred_language',
                ])
            );
        }

        if ($request->hasAny(['phone_number', 'email'])) {
            $user->cv()->updateOrCreate(
                ['user_id' => $user->id],
                $request->only([
                    'phone_number',
                    'email',
                ])
            );
        }

        $user->load(['profile', 'cv']);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => [
                'profile' => $user->profile,
                'cv' => $user->cv,
            ],
        ]);
    }
}
