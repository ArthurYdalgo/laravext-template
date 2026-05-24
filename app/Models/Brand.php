<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'name'
    ];

    #region Relationships
    public function vehicles(){
        return $this->hasMany(Vehicle::class);
    }
}
