<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\PasskeyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasskeyController extends Controller
{
    public function __construct(
        protected PasskeyService $passkey_service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user_passkeys = $this->passkey_service->getUserPasskeys($request);
        return response()->json(['passkeys' => $user_passkeys]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->passkey_service->removePasskey($request, $id);
        return response()->json(['message' => 'Passkey removed.']);
    }
}