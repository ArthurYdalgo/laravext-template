<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $payment_methods = [
            [
                'tag' => 'pix',
                'name' => 'Pix',
            ],
            [
                'tag' => 'credit_card',
                'name' => 'Cartão de Crédito',
            ],
            [
                'tag' => 'debit_card',
                'name' => 'Cartão de Débito',
            ],
            [
                'tag' => 'cash',
                'name' => 'Dinheiro',
            ],
        ];

        foreach ($payment_methods as $method) {
            PaymentMethod::updateOrCreate(
                ['tag' => $method['tag']],
                ['name' => $method['name']]
            );
        }
    }
}
