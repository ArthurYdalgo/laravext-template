<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $first_name = $this->faker->firstName();
        $last_name = $this->faker->lastName();

        $name = "{$first_name} {$last_name}";
        $email = str("{$first_name}.{$last_name}." . random_int(1000, 9999) . '@example.com')->lower()->unnaccent()->replace(' ', '.');

        return [
            'name' => $name,
            'email' => $email,
            'birthday' => $this->faker->date('Y-m-d', '-18 years'),
            'cpf' => $this->faker->unique()->numerify('###.###.###-##'),
            'license_number' => strtoupper($this->faker->bothify('??######')),
            'license_issuing_state' => fake()->stateAbbr(),
        ];
    }
}
