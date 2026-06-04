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