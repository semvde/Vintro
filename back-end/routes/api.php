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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/coach', [CoachController::class, 'chat']);
Route::post('/tts', [TTSController::class, 'tts']);

// PROTECTED ROUTES (JWT required)
Route::middleware('user')->group(function () {
  Route::get('/profile', [ProfileController::class, 'show']);
  Route::put('/profile', [ProfileController::class, 'update']);
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/profile/generate', [ProfileGenerationController::class, 'generate']);


  //vacancycontroller + feedback
  Route::get('/vacancies', [VacancyController::class, 'index']);
  Route::get('/vacancies/{id}', [VacancyController::class, 'show']);
  Route::get('/vacancy-feedback', [VacancyFeedbackController::class, 'index']);
  Route::get('/vacancy-feedback/{id}', [VacancyFeedbackController::class, 'show']);

  //VACANCIES GENEREREN?
  Route::post('/vacancies/generate', [VacancyController::class, 'generateFakeVacancies']);

  //interview feedback
  Route::get('/interview-feedback', [InterviewFeedbackController::class, 'index']);
  Route::get('/interview-feedback/{id}', [InterviewFeedbackController::class, 'show']);

  //Onboarding
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


