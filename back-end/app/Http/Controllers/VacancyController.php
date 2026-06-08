<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;

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

    public function sendVacancy(Request $request, $id)
    {

    }
}
