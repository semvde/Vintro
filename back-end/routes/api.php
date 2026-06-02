<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\TTSController;

Route::prefix('onboarding')->group(function () {
    Route::get('/start', [OnboardingController::class, 'start']);
    Route::post('/chat', [OnboardingController::class, 'chat']);
});

Route::post('/tts', [TTSController::class, 'tts']);