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
Route::nexus('', root_view: 'sections.guest')->name('home');

// Some of these route is explicitly named to be consistent with the Laravel default,
// like "password.reset" and "password.confirm"
Route::middleware(['auth'])->group(function () {
    Route::laravext("dashboard");
    Route::laravext('settings');
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile');
    Route::get('users', [UserController::class, 'index']);

    Route::nexus('confirm-password')->name('password.confirm');
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');
});

Route::middleware(['guest'])->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::nexus('register', root_view: 'sections.guest')->name('register');
    
    Route::nexus('reset-password/{token}', root_view: 'sections.guest')->name('password.reset');
});


