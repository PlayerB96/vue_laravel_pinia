<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(auth()->check() ? '/dashboard' : '/login');
});

Route::middleware('guest')->group(function (): void {
    Route::get('/login', fn () => view('spa'))->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', fn () => view('spa'))->name('dashboard');
    Route::get('/dashboard/{any}', fn () => view('spa'))->where('any', '.*');

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});
