<?php

namespace App\Http\QueryBuilder\Filters\Vehicle;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class AvailableBetween implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $dates = is_array($value) ? $value : explode(',', $value);

        if (count($dates) !== 2) {
            return $query;
        }

        $start_date = trim($dates[0]);
        $end_date = trim($dates[1]);

        return $query->availableBetween($start_date, $end_date);
    }
}
