<?php

namespace App\Http\Requests\Api\Rental;

use App\Models\Vehicle;
use App\Http\Requests\Api\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        /** @todo additional validation */
        $rental = $this->route('rental');

        $vehicle = $rental->vehicle;
        $start_date = $this->input('start_date', $rental->start_date);
        $end_date = $this->input('end_date', $rental->end_date);

        if(!$vehicle->isAvailableBetween($start_date, $end_date, rental_to_ignore: $rental)){
            return $this->failedAuthorization('O veículo não está disponível nesse período.');
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
            'customer_id' => ['sometimes', 'exists:customers,id'],
            'vehicle_id' => ['sometimes', 'exists:vehicles,id'],
            'vehicle_price_per_day' => ['sometimes', 'numeric', 'min:0'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'canceled_at' => ['nullable', 'date'],
            'paid_at' => ['nullable', 'date'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'payment_methods' => ['sometimes', 'array'],
            'payment_methods.*.id' => ['sometimes', 'exists:payment_methods,id', 'required_with:payment_methods'],
            'payment_methods.*.amount' => ['sometimes', 'numeric', 'min:0', 'required_with:payment_methods'],
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
