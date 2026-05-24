<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\CurrentUserController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\SearchZipCodeController;
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
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/user', CurrentUserController::class);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::patch('/settings/profile', [ProfileController::class, 'update']);
    Route::delete('/settings/profile', [ProfileController::class, 'destroy']);
    Route::put('/settings/password', [PasswordController::class, 'update']);

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1');
        
    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::get('media/{media}/display', [MediaController::class, 'display'])->name('media.display');

    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('vehicles', VehicleController::class)->except(['index', 'show']);
    Route::apiResource('vehicles', VehicleController::class)->withoutMiddleware(['auth'])->only(['index', 'show']);
    Route::apiResource('rentals', RentalController::class);

    Route::get('colors', [ColorController::class, 'index'])->withoutMiddleware(['auth']);
    Route::get('brands', [BrandController::class, 'index'])->withoutMiddleware(['auth']);
    Route::get('payment-methods', [PaymentMethodController::class, 'index']);

    Route::get("tools/search-zip-code", SearchZipCodeController::class);
});
