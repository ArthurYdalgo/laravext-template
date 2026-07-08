<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\TwoFactorAuthenticationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;

class TwoFactorController extends Controller
{
    public function __construct(
        protected TwoFactorAuthenticationService $two_factor_service
    ) {}

    public function enable(Request $request): JsonResponse
    {
        $this->two_factor_service->enableTwoFactor($request);
        return response()->json(['message' => 'Two-factor authentication enabled.']);
    }

    public function disable(Request $request): JsonResponse
    {
        $this->two_factor_service->disableTwoFactor($request);
        return response()->json(['message' => 'Two-factor authentication disabled.']);
    }

    public function showSetupData(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'svg' => $user->twoFactorQrCodeSvg(),
            'secretKey' => decrypt($user->two_factor_secret),
        ]);
    }

    public function showRecoveryCodes(Request $request): JsonResponse
    {
        return response()->json([
            'codes' => $request->user()->recoveryCodes(),
        ]);
    }

    public function confirm(Request $request, ConfirmTwoFactorAuthentication $confirm): \Illuminate\Http\JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        // Fortify verifies the 6-digit code
        $confirm($request->user(), $request->code);

        // Fetch the codes immediately after successful confirmation
        $codes = $request->user()->recoveryCodes();

        return response()->json([
            'message' => 'Two-factor authentication confirmed.',
            'recovery_codes' => $codes,
        ]);
    }
}
