<?php

use App\Http\Controllers\Api\Auth\PasskeyController;
use App\Http\Controllers\Api\Auth\TwoFactorController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\CurrentUserController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DeviceSyncController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\SearchZipCodeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VaultController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/login/challenge', [AuthenticatedSessionController::class, 'challenge']);
    
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});


Route::middleware(['auth'])->group(function () {

    Route::middleware(['password.confirm'])->group(function () {
        Route::post('/auth/two-factor-authentication/enable', [TwoFactorController::class, 'enable']);
        Route::post('/auth/two-factor-authentication/disable', [TwoFactorController::class, 'disable']);
        Route::get('/auth/two-factor-authentication/setup-data', [TwoFactorController::class, 'showSetupData']);
        Route::post('/auth/two-factor-authentication/confirm', [TwoFactorController::class, 'confirm']);
    
        // Passkey Registration API Routes
        Route::get('/auth/passkeys', [PasskeyController::class, 'index']);
        Route::delete('/auth/passkeys/{id}', [PasskeyController::class, 'destroy']);
    });

    Route::get('/user', CurrentUserController::class);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::patch('/settings/profile', [ProfileController::class, 'update']);
    Route::delete('/settings/profile', [ProfileController::class, 'destroy']);
    Route::put('/settings/password', [PasswordController::class, 'update']);

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1');

    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::apiResource('users', UserController::class)->only('index');

    // Route::get("tools/search-zip-code", SearchZipCodeController::class);
});
