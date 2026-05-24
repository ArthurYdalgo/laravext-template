<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PaymentMethodRental extends Pivot
{
    protected $fillable = [
        'payment_method_id',
        'rental_id',
        'amount',
    ];

    protected function casts(){
        return [
            'amount' => 'decimal:2',
        ];
    }

    #region Relationships
    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    public function paymentMethod(){
        return $this->belongsTo(PaymentMethod::class);
    }
}
