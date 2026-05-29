<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\QueryBuilder\Filters\User\Search;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = QueryBuilder::for(User::class)
            ->allowedIncludes(['phone'])
            ->allowedFilters([
                AllowedFilter::callback('search', new Search),
            ])
            ->paginate(min(200, $request->query('per_page')));

        return UserResource::collection($users);
    }
}
