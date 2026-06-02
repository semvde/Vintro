<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\TTSController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('onboarding')->group(function () {
    Route::get('/start', [OnboardingController::class, 'start']);
    Route::post('/chat', [OnboardingController::class, 'chat']);
});

Route::post('/tts', [TTSController::class, 'tts']);

// PROTECTED ROUTES (JWT required)
Route::middleware('auth:api')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});

