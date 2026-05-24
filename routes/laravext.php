<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
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
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile');

    Route::nexus('confirm-password')->name('password.confirm');
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::laravext('clientes');
    Route::get("clientes/{customer}/editar", [CustomerController::class, 'edit'])->name('clientes.customer.editar');
    Route::get("clientes/{customer}", [CustomerController::class, 'show'])->name('clientes.customer');

    Route::laravext('veiculos');
    Route::get("veiculos", [VehicleController::class, 'index'])->name('veiculos');
    Route::get("veiculos/cadastrar", [VehicleController::class, 'create'])->name('veiculos.cadastrar');
    Route::get("veiculos/{vehicle}/editar", [VehicleController::class, 'edit'])->name('veiculos.vehicle.editar');
    Route::get("veiculos/{vehicle}", [VehicleController::class, 'show'])->name('veiculos.vehicle');

    Route::laravext('reservas');
    Route::get("reservas/cadastrar", [RentalController::class, 'create'])->name('reservas.cadastrar');
    Route::get("reservas/{rental}/editar", [RentalController::class, 'edit'])->name('reservas.rental.editar');
    Route::get("reservas/{rental}", [RentalController::class, 'show'])->name('reservas.rental');
});

Route::middleware(['guest'])->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::nexus('register')->name('register');
    
    Route::nexus('reset-password/{token}')->name('password.reset');
});


