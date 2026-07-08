<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\Socialite\GoogleAuthenticationController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Socialite;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');
});

Route::get('/auth/google/redirect', [GoogleAuthenticationController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [GoogleAuthenticationController::class, 'callback'])->name('auth.google.callback');

Route::any('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__ . '/auth.php';
require __DIR__ . '/laravext.php';
