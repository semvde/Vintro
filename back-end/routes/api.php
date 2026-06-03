<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\TTSController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VacancyController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('onboarding')->group(function () {
    Route::get('/start', [OnboardingController::class, 'start']);
    Route::post('/chat', [OnboardingController::class, 'chat']);
});

Route::post('/tts', [TTSController::class, 'tts']);

// PROTECTED ROUTES (JWT required)
Route::middleware('user')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::get('/vacancies/{id}', [VacancyController::class, 'show']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// als we de onboarding routes ook willen beschermen, kunnen we deze in de auth:api middleware zetten. Voor nu laten we ze open zodat we makkelijk kunnen testen zonder steeds te moeten inloggen.
//Route::middleware('auth:api')->group(function () {
//    Route::prefix('onboarding')->group(function () {
//       Route::get('/start', [OnboardingController::class, 'start']);
//        Route::post('/chat', [OnboardingController::class, 'chat']);
//    });
//});
//frontend moet bearer token meesturen