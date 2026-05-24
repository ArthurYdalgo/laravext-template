<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable = [
        'name',
        'hex',
    ];

    #region Relationships
    public function vehicles(){
        return $this->hasMany(Vehicle::class);
    }
}
