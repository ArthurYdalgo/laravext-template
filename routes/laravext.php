<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::laravext();

/**
 * This is done to give a proper name to the welcome route, so it can be
 * referenced using the route helper.
 */
Route::nexus('')->name('home');

// Some of these route is explicitly named to be consistent with the Laravel default,
// like "password.reset" and "password.confirm"
Route::middleware(['auth'])->group(function () {
    Route::laravext("dashboard");
    Route::laravext('settings');
    Route::nexus('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile');
    Route::nexus('users/{user}', [UserController::class, 'show'])->name('users.user');
    Route::nexus('users/{user}/edit', [UserController::class, 'edit'])->name('users.user.edit');

    Route::nexus('confirm-password')->name('password.confirm');
    Route::nexus('verify-email', EmailVerificationPromptController::class)->name('verification.notice');
});

Route::middleware(['guest'])->group(function () {
    Route::nexus('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::nexus('register')->name('register');
    
    Route::nexus('reset-password/{token}')->name('password.reset');
});


