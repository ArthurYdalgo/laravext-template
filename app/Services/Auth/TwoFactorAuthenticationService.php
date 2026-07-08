<?php

namespace App\Services\Auth;

use Illuminate\Http\Request;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;

class TwoFactorAuthenticationService
{
    public function enableTwoFactor(Request $request): void
    {
        $enable_action = app(EnableTwoFactorAuthentication::class);
        $enable_action($request->user());
    }

    public function disableTwoFactor(Request $request): void
    {
        $disable_action = app(DisableTwoFactorAuthentication::class);
        $disable_action($request->user());
    }

    public function regenerateRecoveryCodes(Request $request): void
    {
        $generate_action = app(GenerateNewRecoveryCodes::class);
        $generate_action($request->user());
    }
}