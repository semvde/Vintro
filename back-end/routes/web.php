<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login-test', function () {
    return view('login-test');
});

Route::get('/chat-test', function () {
    return view('chat-test');
});

Route::get('/profile-test', function () {
    return view('profile-test');
});

Route::get('/vacancies-test', function () {
    return view('vacancies-test');
});

Route::get('/vacancy-test/{id}', function () {
    return view('vacancy-test');
});