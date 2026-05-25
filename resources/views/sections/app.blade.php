@extends('layouts.app')
@section('content')
    @nexus

    <native:bottom-nav>
        <native:bottom-nav-item id="customers" icon="person" label="Clientes" url="/clientes" />
        <native:bottom-nav-item id="vehicles" icon="car" label="Veículos" url="/veiculos" />
        <native:bottom-nav-item id="reservations" icon="ticket" label="Reservas" url="/reservas" />
        <native:bottom-nav-item id="settings" icon="settings" label="Configurações" url="/settings" />
    </native:bottom-nav>
@endsection
