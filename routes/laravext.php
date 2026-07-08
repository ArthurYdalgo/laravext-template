<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\Settings\PasskeySettingsController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorSettingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::laravext();

Route::middleware(['auth'])->group(function () {
    Route::laravext("dashboard");
    Route::laravext('settings'); 
});

/**
 * This is done to give a proper name to the welcome route, so it can be
 * referenced using the route helper.
 */
Route::nexus('')->name('home');

// Some of these route is explicitly named to be consistent with the Laravel default,
// like "password.reset" and "password.confirm"
Route::middleware(['auth'])->group(function () {
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile');
    
    Route::nexus('users/{user}', [UserController::class, 'show'])->name('users.user');
    Route::nexus('users/{user}/edit', [UserController::class, 'edit'])->name('users.user.edit');

    Route::nexus('confirm-password')->name('password.confirm');
    Route::nexus('verify-email', EmailVerificationPromptController::class)->name('verification.notice');
    
    Route::middleware(['password.confirm'])->group(function () {
        Route::get('settings/two-factor-authentication', [TwoFactorSettingsController::class, 'show'])->name('settings.two-factor-authentication');
        Route::get('settings/passkeys', [PasskeySettingsController::class, 'show'])->name('settings.passkeys');
    });
});

Route::middleware(['guest'])->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::nexus('register')->name('register');

    Route::nexus('reset-password/{token}')->name('password.reset');
});
