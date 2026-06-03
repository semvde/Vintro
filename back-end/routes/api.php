<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\TTSController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VacancyController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/coach', [CoachController::class, 'chat']);
Route::post('/tts', [TTSController::class, 'tts']);

// PROTECTED ROUTES (JWT required)
Route::middleware('user')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::get('/vacancies/{id}', [VacancyController::class, 'show']);
    Route::get('/onboarding/sessions', [OnboardingController::class, 'sessions']);
    Route::prefix('onboarding')->group(function () {
        Route::get('/start', [OnboardingController::class, 'start']);
        Route::post('/chat', [OnboardingController::class, 'chat']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

});

