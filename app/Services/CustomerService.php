<?php

namespace App\Services;

use App\Models\Customer;

class CustomerService
{

    public function __construct(public ?Customer $customer = null) {}

    public static function updateOrCreate(array $data, ?Customer $customer = null)
    {
        $customer_data = collect($data)
            ->only([
                'name',
                'email',
                'birthday',
                'cpf',
                'license_number',
                'license_issuing_state'
            ])->toArray();

        if($customer){
            $customer->update($customer_data);
        }else{
            $customer = Customer::create($customer_data);
        }

        if(array_key_exists('phone', $data)){
            $customer->setPhone($data['phone']);
        }

        if(array_key_exists('address', $data)){
            $customer->setAddress(...$data['address']);
        }

        return $customer;
    }
}
