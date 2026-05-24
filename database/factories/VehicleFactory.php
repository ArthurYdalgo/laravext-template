<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Color;
use App\Services\VehicleService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_id' => Brand::inRandomOrder()->first()->id,
            'color_id' => Color::inRandomOrder()->first()->id,
            'type' => $this->faker->randomElement(array_keys(VehicleService::$types)),
            'license_plate' => strtoupper($this->faker->bothify('???-####')),
            'name' => $this->faker->randomElement(['Model S', 'Model 3', 'Model X', 'Model Y', 'Civic', 'Corolla', 'Mustang', 'Camry', 'Accord', 'Altima', 'CX-5', 'RAV4', 'Tucson', 'Golf', 'HRV', 'Ka', 'Palio', 'Uno', 'Celta']),
            'year' => $this->faker->numberBetween(2000, 2024),
            'seats' => $this->faker->numberBetween(5, 9),
            'trunk_capacity' => $this->faker->numberBetween(100, 500),
            'price_per_day' => $this->faker->randomFloat(2, 100, 500),
        ];
    }
}
