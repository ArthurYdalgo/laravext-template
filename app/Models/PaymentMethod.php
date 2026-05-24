<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'name',
        'tag'
    ];

    #region Relationships
    public function rentals(){
        return $this->belongsToMany(Rental::class, 'payment_method_rental');
    }
}
