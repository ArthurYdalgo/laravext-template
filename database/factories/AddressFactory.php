<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'state' => fake()->stateAbbr(),
            'city' => fake()->city(),
            'district' => fake()->randomElement(['Vila da ', 'Jardim ', 'Parque ', 'Residencial ', 'Conjunto ']) . fake()->lastName(),
            'street' => fake()->streetName(),
            'number' => fake()->buildingNumber(),
            'complement' => "apto " . fake()->randomNumber(2, true),
            'zip_code' => fake()->postcode(),
        ];
    }
}
