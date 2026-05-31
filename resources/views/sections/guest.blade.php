@extends('layouts.app')
@section('content')
    @nexus
    <native:bottom-nav label-visibility="labeled">
        <native:bottom-nav-item id="home" icon="home" label="Início" url="/" />
        <native:bottom-nav-item id="login" icon="login" label="Logar" url="/login" />
        <native:bottom-nav-item id="register" icon="user" label="Cadastrar" url="/register" />
    </native:bottom-nav>
@endsection
