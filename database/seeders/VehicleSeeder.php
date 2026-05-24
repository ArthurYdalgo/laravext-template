<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Database\Factories\VehicleFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Vehicle::factory(500)->create();
    }
}
