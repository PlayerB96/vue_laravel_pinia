<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <div
            id="app"
            class="min-h-screen"
            data-app-name="{{ config('app.name') }}"
            data-authenticated="{{ auth()->check() ? '1' : '0' }}"
            data-user-email="{{ auth()->check() ? auth()->user()->email : '' }}"
            data-show-demo-credentials="{{ app()->environment('local') ? '1' : '0' }}"
        ></div>
    </body>
</html>
