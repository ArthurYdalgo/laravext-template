<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            [
                
                'hex' => '#FF0000',
                'name' => 'Vermelho',
            ],
            [
                
                'hex' => '#0000FF',
                'name' => 'Azul',
            ],
            [
                
                'hex' => '#00FF00',
                'name' => 'Verde',
            ],
            [
                
                'hex' => '#000000',
                'name' => 'Preto',
            ],
            [
                
                'hex' => '#FFFFFF',
                'name' => 'Branco',
            ],
            [
                
                'hex' => '#C0C0C0',
                'name' => 'Prata',
            ],
            [
                
                'hex' => '#808080',
                'name' => 'Cinza',
            ],
            [
                
                'hex' => '#FFFF00',
                'name' => 'Amarelo',
            ],
            [
                
                'hex' => '#FFA500',
                'name' => 'Laranja',
            ],
            [
                
                'hex' => '#A52A2A',
                'name' => 'Marrom',
            ],
            [
                
                'hex' => '#800080',
                'name' => 'Roxo',
            ],
            [
                
                'hex' => '#FFC0CB',
                'name' => 'Rosa',
            ]
        ];

        foreach ($colors as $color) {
            Color::updateOrCreate(
                ['name' => $color['name']],
                ['name' => $color['name'], 'hex' => $color['hex']]
            );
        }
    }
}
