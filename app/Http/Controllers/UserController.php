<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(Request $request, User $user){
        $user->load([
            'address'
        ]);

        return nexus(props: [
            'user' => UserResource::make($user)->resolve()
        ])->render();
    }

    public function edit(Request $request, User $user){
        $user->load([
            'address'
        ]);

        return nexus(props: [
            'user' => UserResource::make($user)->resolve()
        ])->render();
    }
}
