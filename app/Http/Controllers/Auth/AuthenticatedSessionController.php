<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request)
    {
        return nexus(props: [
            'canResetPassword' => Route::has('forgot-password'),
        ])
            ->render();
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        if (! Auth::validate($request->only('email', 'password'))) {
            return response()->json([
                'errors' => ['email' => [__('auth.failed')]]
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        
        if ($user->two_factor_secret) {
            $request->session()->put('login.id', $user->id);
            $request->session()->put('login.remember', $request->boolean('remember'));

            return response()->json([
                'two_factor_required' => true,
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
            'token' => $user->createToken(name: 'api-token')->plainTextToken,
        ]);
    }

    public function challenge(Request $request, \Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider $twoFactor)
    {
        $request->validate(['code' => 'required|string']);

        // Retrieve the user ID we temporarily stored in the session
        $user_id = $request->session()->pull('login.id');
        $remember = $request->session()->pull('login.remember', false);

        if (! $user_id) {
            return response()->json(['message' => 'Login session expired.'], 422);
        }

        $user = User::find($user_id);

        // Verify the 6-digit TOTP code using Fortify's engine
        if (! $twoFactor->verify(decrypt($user->two_factor_secret), $request->code)) {
            return response()->json(['errors' => ['code' => ['The provided two-factor authentication code was invalid.']]], 422);
        }

        // The code is correct! Now we fully log them in.
        Auth::login($user, $remember);
        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
            'token' => $user->createToken(name: 'api-token')->plainTextToken,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->noContent();
        }

        return redirect()->route('home');
    }
}
