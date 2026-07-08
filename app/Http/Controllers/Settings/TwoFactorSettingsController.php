<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TwoFactorSettingsController extends Controller
{
    public function show(Request $request)
    {
        return nexus(props: [
            'has_two_factor_enabled' => ! is_null($request->user()->two_factor_secret),
        ])->render();
    }
}