<?php

namespace App\Http\Controllers\Auth\Socialite;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Socialite;

class GoogleAuthenticationController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $google_user = Socialite::driver('google')->user();

        $user = User::updateOrCreate([
            'google_id' => $google_user->id,
        ], [
            'name' => $google_user->name,
            'email' => $google_user->email,
            'google_token' => $google_user->token,
            'google_refresh_token' => $google_user->refreshToken,
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    }
}
