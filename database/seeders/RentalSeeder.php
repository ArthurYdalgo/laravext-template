<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\Rental;
use App\Models\Vehicle;
use App\Services\RentalService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Lottery;

class RentalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
        $methods = PaymentMethod::all();

        for($i = 0; $i < 300; $i++) {
            do {
                $start_date = fake()->dateTimeBetween('-3 years', '+12 months');
                $end_date = (clone $start_date)->modify('+'.fake()->numberBetween(1, 15).' days');
                
                $vehicle = Vehicle::availableBetween($start_date, $end_date)->inRandomOrder()->first();
                $vehicle_id = $vehicle?->id;

            } while (!$vehicle_id);

            $customer_id = $customers->random()->id;

            $vehicle_price_per_day = $vehicle->price_per_day;
            $days = (int) $end_date->diff($start_date)->format('%a') + 1;
            $price = $vehicle_price_per_day * $days;
            $paid_at = (clone $start_date)->modify('+'.fake()->numberBetween(0, 2).' days');

            $canceled_at = Lottery::odds(1, 100)->choose() ? (clone $start_date)->modify('+'.fake()->numberBetween(0, 2).' days') : null;

            $payment_methods_count = fake()->numberBetween(1, 3);
            $payment_methods = [];

            $amount_left = $price;

            foreach ($methods->random($payment_methods_count) as $index => $method) {
                // take incrementally less for each method, so the total is always equal to the price
                $amount = fake()->randomFloat(2, 1, $amount_left / 2);

                if($index == $payment_methods_count - 1 || $amount > $amount_left) {
                    $amount = $amount_left;
                }

                $amount_left -= $amount;

                $payment_methods[] = [
                    'id' => $method->id,
                    'amount' => $amount,
                ];
            }

            RentalService::updateOrCreate(compact('customer_id', 'vehicle_id', 'days', 'vehicle_price_per_day', 'price', 'paid_at', 'start_date', 'end_date', 'canceled_at', 'payment_methods'));
        }
    }
}
