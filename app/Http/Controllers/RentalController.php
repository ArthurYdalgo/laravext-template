<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Models\Rental;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function show(Rental $rental) {
        $rental->loadMissing(['paymentMethods', 'customer', 'vehicle' => function($query){
            $query->with(['color', 'brand']);
        }]);

        return nexus(props: [
            'rental' => $rental->toResource()
        ])->render();
    }

    public function edit(Rental $rental) {
        $payment_methods = PaymentMethod::all();

        $rental->load(['paymentMethods', 'customer', 'vehicle' => function($query){
            $query->with(['color', 'brand']);
        }]);

        return nexus(props: [
            'rental' => $rental->toResource(),
            'payment_methods' => $payment_methods,
        ])->render();
    }

    public function create() {
        $payment_methods = PaymentMethod::all();

        return nexus(props: compact('payment_methods'))->render();
    }
}
