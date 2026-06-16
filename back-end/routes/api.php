<?php

use App\Http\Controllers\InterviewFeedbackController;
use App\Http\Controllers\VacancyFeedbackController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\TTSController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\ProfileGenerationController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\interviewController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// PROTECTED ROUTES (JWT required)
Route::middleware('user')->group(function () {

    // Coach & TTS
    Route::post('/coach', [CoachController::class, 'chat']);
    Route::post('/tts', [TTSController::class, 'tts']);
// Profile & Auth
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

// Vacancies
    Route::post('/vacancies/generate', [VacancyController::class, 'generateFakeVacancies']);
    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::get('/vacancies/{id}', [VacancyController::class, 'show']);

// Vacancy Feedback
    Route::post('/vacancy-feedback', [VacancyFeedbackController::class, 'store']);
    Route::get('/vacancy-feedback', [VacancyFeedbackController::class, 'index']);
    Route::get('/vacancy-feedback/accepted', [VacancyFeedbackController::class, 'accepted']);
    Route::get('/vacancy-feedback/{id}', [VacancyFeedbackController::class, 'showById']);
    Route::get('/vacancies/{vacancy}/feedback', [VacancyFeedbackController::class, 'show']);

// Interview Feedback
    Route::get('/interview-feedback', [InterviewFeedbackController::class, 'index']);
    Route::get('/interview-feedback/{vacancyid}', [InterviewFeedbackController::class, 'show']);
// Interviews
    Route::prefix('interviews/{vacancyId}')->group(function () {
        Route::get('/start', [InterviewController::class, 'start']);
        Route::post('/chat', [InterviewController::class, 'chat']);
    });
    Route::get('/interviews', [InterviewController::class, 'index']);
    Route::get('/interviews/{id}', [InterviewController::class, 'show']);
// Onboarding
    Route::get('/onboarding/sessions', [OnboardingController::class, 'sessions']);
    Route::prefix('onboarding')->group(function () {
        Route::get('/start', [OnboardingController::class, 'start']);
        Route::post('/chat', [OnboardingController::class, 'chat']);
    });

// Videos & Categories (from feature/US11-videos)
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/videos/{id}', [VideoController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

// Profile Generation
    Route::post('/profile/generate', [ProfileGenerationController::class, 'generate']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

});


