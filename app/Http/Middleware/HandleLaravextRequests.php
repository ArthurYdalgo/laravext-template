<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Laravext\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleLaravextRequests extends Middleware
{
    public function share(Request $request)
    {   
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $appearance = $request->cookie('appearance', $_COOKIE['appearance'] ?? 'light');
        $sidebar = $request->cookie('sidebar', $_COOKIE['sidebar'] ?? 'true');
        $user = $request->user();

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? new UserResource($user) : null,
            ],
            'ziggy' => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'appearence' => $appearance,
            'sidebar' => $sidebar,
        ]);

    }
}
