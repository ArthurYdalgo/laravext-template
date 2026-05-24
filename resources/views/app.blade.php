<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="{{ (request()->cookie('appearance') ?? $_COOKIE['appearance'] ?? 'dark') === 'dark' ? 'dark' : ''}}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <title>{{ @$head['title'] ?? config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        
        @vite(['resources/css/app.css'])

        
    </head>
    <body class="font-sans antialiased">
        @nexus
        @routes
        @laravextScripts
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        
        {{-- <native:bottom-nav>
            <native:bottom-nav-item id="customers" icon="person" label="Clientes" url="/clientes" />
            <native:bottom-nav-item id="vehicles" icon="car" label="Veículos" url="/veiculos" />
            <native:bottom-nav-item id="reservations" icon="ticket" label="Reservas" url="/reservas" />
            <native:bottom-nav-item id="settings" icon="settings" label="Configurações" url="/settings" />
        </native:bottom-nav> --}}
    </body>
</html>
