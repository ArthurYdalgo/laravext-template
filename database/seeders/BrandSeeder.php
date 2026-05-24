<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Toyota',
            ],
            [
                'name' => 'Honda',
            ],
            [
                'name' => 'Ford',
            ],
            [
                'name' => 'Chevrolet',
            ],
            [
                'name' => 'Nissan',
            ],
            [
                'name' => 'Volkswagen',
            ],
            [
                'name' => 'Hyundai',
            ],
            [
                'name' => 'Kia',
            ],
            [
                'name' => 'Mazda',
            ],
            [
                'name' => 'Subaru',
            ],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(
                ['name' => $brand['name']]
            );
        }
    }
}
