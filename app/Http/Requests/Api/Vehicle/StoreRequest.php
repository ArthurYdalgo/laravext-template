<?php

namespace App\Http\Requests\Api\Vehicle;

use App\Services\VehicleService;
use App\Http\Requests\Api\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'brand_id' => ['required', 'exists:brands,id'],
            'color_id' => ['required', 'exists:colors,id'],

            'type' => ['required', 'string', 'max:255', Rule::in(array_keys(VehicleService::$types))],
            'license_plate' => ['required', 'string', 'max:20'],
            'name' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'seats' => ['required', 'integer', 'min:1'],
            'trunk_capacity' => ['nullable', 'numeric', 'min:0'],
            'price_per_day' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function attributes()
    {
        return [
            'brand_id' => 'marca',
            'color_id' => 'cor',
            'type' => 'tipo',
            'license_plate' => 'placa',
            'name' => 'nome',
            'year' => 'ano',
            'seats' => 'número de assentos',
            'trunk_capacity' => 'capacidade do porta-malas',
            'price_per_day' => 'preço por dia',
        ];
    }
}
