<?php

namespace App\Http\Requests\Api\Rental;

use App\Http\Requests\Api\FormRequest;
use App\Models\Vehicle;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        /** @todo additional validation */

        $vehicle = Vehicle::find($this->input('vehicle_id'));
        $start_date = $this->input('start_date');
        $end_date = $this->input('end_date');

        if(!$vehicle->isAvailableBetween($start_date, $end_date)){
            return $this->failedAuthorization('O veículo selecionado não está disponível nesse período.');
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'vehicle_price_per_day' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'paid_at' => ['nullable', 'date'],
            'canceled_at' => ['nullable', 'date'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'payment_methods' => ['required', 'array'],
            'payment_methods.*.id' => ['required', 'exists:payment_methods,id'],
            'payment_methods.*.amount' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function attributes()
    {
        return [
            'customer_id' => 'cliente',
            'vehicle_id' => 'veículo',
            'vehicle_price_per_day' => 'preço do veículo por dia',
            'price' => 'preço',
            'paid_at' => 'data de pagamento',
            'start_date' => 'data de início',
            'end_date' => 'data de término',
            'payment_methods' => 'métodos de pagamento',
            'payment_methods.*.id' => 'método de pagamento',
            'payment_methods.*.amount' => 'valor do método de pagamento',
        ];
    }
}
