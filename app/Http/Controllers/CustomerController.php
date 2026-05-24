<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function show(Customer $customer) {
        $customer->loadMissing(['phone', 'address']);

        return nexus(props: [
            'customer' => $customer->toResource()
        ])->render();
    }

    public function edit(Customer $customer) {
        $customer->loadMissing(['phone', 'address']);
        
        return nexus(props: [
            'customer' => $customer->toResource()
        ])->render();
    }
}
