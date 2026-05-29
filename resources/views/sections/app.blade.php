@extends('layouts.app')
@section('content')
    <native:top-bar title="Dashboard" subtitle="Welcome back">
         <native:top-bar-action
        id="settings"
        icon="settings"
        label="Settings"
        url="/settings"
    />
    </native:top-bar>

    <native:side-nav gestures-enabled="true">
        <native:side-nav-header title="My App" subtitle="user@example.com" icon="person" url="/settings/profile" :show-close-button="false" />
        
        <native:side-nav-item id="home" label="Home" icon="home" url="/home" :active="true" />

        <native:side-nav-group heading="Account" :expanded="false">
            <native:side-nav-item id="profile" label="Profile" icon="person" url="/settings/profile" />
            <native:side-nav-item id="settings" label="Settings" icon="settings" url="/settings" />
        </native:side-nav-group>

        <native:horizontal-divider />

        <native:side-nav-item id="logout" label="Sair" icon="exit" url="/logout" />

        <native:side-nav-item id="help" label="Help" icon="help" url="https://help.example.com"
            open-in-browser="true" />
    </native:side-nav>
    @nexus

    <native:bottom-nav label-visibility="labeled">
        <native:bottom-nav-item id="customers" icon="person" label="Customers" url="/clientes" />
        <native:bottom-nav-item id="vehicles" icon="car.side.fill" label="Vehicless" url="/veiculos" />
        <native:bottom-nav-item id="reservations" icon="ticket" label="Reservations" url="/reservas" />
        <native:bottom-nav-item badge="1" id="settings" icon="settings" label="Settings" url="/settings" />
    </native:bottom-nav>
@endsection
