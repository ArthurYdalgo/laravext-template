<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\Auth\PasskeyService;
use Illuminate\Http\Request;
use Laravext\Laravext;

class PasskeySettingsController extends Controller
{
    public function show(Request $request, PasskeyService $passkey_service)
    {
        return nexus(props: [
            'passkeys' => $passkey_service->getUserPasskeys($request)
        ])->render();
    }
}