<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('Credenciales incorrectas.'),
            ]);
        }

        $request->session()->regenerate();

        if ($request->expectsJson()) {
            return response()->json([
                'user' => ['email' => $request->user()->email],
                'csrf_token' => csrf_token(),
            ]);
        }

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request): JsonResponse|RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'csrf_token' => csrf_token(),
            ]);
        }

        return redirect()->route('login');
    }
}
