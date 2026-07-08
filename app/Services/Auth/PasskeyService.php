<?php

namespace App\Services\Auth;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

class PasskeyService
{
    public function getUserPasskeys(Request $request): Collection
    {
        // Assuming the PasskeyAuthenticatable trait is on the User model
        return $request->user()->passkeys()->orderBy('created_at', 'desc')->get();
    }

    public function removePasskey(Request $request, string $passkey_id): void
    {
        $request->user()->passkeys()->where('id', $passkey_id)->delete();
    }
}