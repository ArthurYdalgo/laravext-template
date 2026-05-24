<?php

namespace App\Http\QueryBuilder\Filters\Rental;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class Search implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        return $query->where(function ($query) use ($value) {
            $query->whereHas('customer', function ($query) use ($value) {
                $query->where(function ($query) use ($value) {
                    $query->whereAny(['name', 'email', 'license_number'], 'LIKE', "%{$value}%")
                        ->orWhere("cpf", $value)
                        ->orWhereHas('phone', function ($query) use ($value) {
                            $query->where('number', 'LIKE', "%{$value}%");
                        });
                });
            })->orWhereHas('vehicle', function ($query) use ($value) {
                $query->whereLike('name', "%{$value}%")
                    ->orWhereLike('license_plate', "{$value}%")
                    ->orWhere('year', $value);
            });
        });
    }
}
