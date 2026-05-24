<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\QueryBuilder\Filters\Rental\Search;
use App\Http\Requests\Api\Rental\StoreRequest;
use App\Http\Requests\Api\Rental\UpdateRequest;
use App\Http\Resources\RentalResource;
use App\Models\Rental;
use App\Services\RentalService;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\QueryBuilder;

class RentalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $rentals = QueryBuilder::for(Rental::class)
            ->allowedFilters([
                AllowedFilter::custom('search', new Search),
            ])
            ->allowedIncludes([
                'customer',
                AllowedInclude::callback('vehicle', function ($query) {
                    $query->with(['color', 'brand']);
                }),
            ])
            ->allowedSorts([
                'start_date',
                'end_date',
                'price',
                'paid_at',
                'canceled_at',
            ])
            ->paginate(min($request->query('per_page', 15), 100));

        return RentalResource::collection($rentals);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        $rental = RentalService::updateOrCreate($data);

        return new RentalResource($rental);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rental $rental)
    {
        $rental->loadMissing(['paymentMethods', 'customer', 'vehicle' => function($query){
            $query->with(['color', 'brand']);
        }]);

        return new RentalResource($rental);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Rental $rental)
    {
        $data = $request->validated();

        $rental = RentalService::updateOrCreate($data, $rental);

        return new RentalResource($rental);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rental)
    {
        $rental->delete();

        return response()->noContent();
    }
}
