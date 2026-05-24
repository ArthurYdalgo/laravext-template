<?php

namespace App\Http\Requests\Api\Vehicle;

use App\Services\VehicleService;
use App\Http\Requests\Api\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
            'brand_id' => ['sometimes', 'exists:brands,id'],
            'color_id' => ['sometimes', 'exists:colors,id'],

            'type' => ['sometimes', 'string', 'max:255', Rule::in(array_keys(VehicleService::$types))],
            'license_plate' => ['sometimes', 'string', 'max:20'],
            'name' => ['sometimes', 'string', 'max:255'],
            'year' => ['sometimes', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'seats' => ['sometimes', 'integer', 'min:1'],
            'trunk_capacity' => ['nullable', 'numeric', 'min:0'],
            'price_per_day' => ['sometimes', 'numeric', 'min:0'],
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
