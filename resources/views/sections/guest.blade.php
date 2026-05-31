@extends('layouts.app')
@section('content')
    @nexus
    <native:bottom-nav label-visibility="labeled">
        <native:bottom-nav-item id="home" icon="home" label="Home" url="/" />
        <native:bottom-nav-item id="login" icon="login" label="Log In" url="/login" />
        <native:bottom-nav-item id="register" icon="user" label="Register" url="/register" />
    </native:bottom-nav>
@endsection
