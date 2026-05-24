<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehicleResource;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Vehicle;
use App\Services\VehicleService;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        $colors = Color::all();
        $brands = Brand::all();

        return nexus(props: compact('colors', 'brands'))->render();
    }

    public function show(Vehicle $vehicle)
    {   
        $vehicle->loadMissing(['brand', 'color']);

        return nexus(props: [
            'vehicle' => $vehicle->toResource(),
        ])->render();
    }

    public function edit(Vehicle $vehicle)
    {
        $colors = Color::all();
        $brands = Brand::all();
        $vehicle_types = VehicleService::types();

        $vehicle->loadMissing(['brand', 'color']);

        return nexus(props: [
            'vehicle' => $vehicle->toResource(),
            'colors' => $colors,
            'brands' => $brands,
            'vehicle_types' => $vehicle_types,
        ])->render();
    }

    public function create()
    {
        $colors = Color::all();
        $brands = Brand::all();
        $vehicle_types = VehicleService::types();

        return nexus(props: compact('colors', 'brands', 'vehicle_types'))->render();
    }
}
