<?php

namespace App\Http\QueryBuilder\Filters\Vehicle;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class Search implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        return $query->where(function ($query) use ($value) {
            $query->whereLike('name', "%{$value}%")
                ->orWhereLike('license_plate', "{$value}%")
                ->orWhere('year', $value);
        });
    }
}
