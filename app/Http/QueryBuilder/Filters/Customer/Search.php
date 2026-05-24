<?php

namespace App\Http\QueryBuilder\Filters\Customer;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class Search implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        return $query->where(function ($query) use ($value) {
            $query->whereAny(['name', 'email', 'license_number'], 'LIKE', "%{$value}%")
                ->orWhereHas('phone', function ($query) use ($value) {
                    $query->where('number', 'LIKE', "%{$value}%");
                });
        });
    }
}
