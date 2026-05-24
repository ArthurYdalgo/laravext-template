<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\FormRequest;

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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:customers,email'],
            'cpf' => ['required', 'string', 'max:30', 'unique:customers,cpf'],
            'birthday' => ['required', 'date'],
            'license_number' => ['required', 'string', 'unique:customers,license_number'],
            'license_issuing_state' => ['required', 'string', 'size:2'],
            'address' => ['required', 'array'],
            'address.street' => ['required', 'string', 'max:255'],
            'address.number' => ['required', 'string', 'max:30'],
            'address.zip_code' => ['required', 'string', 'max:20'],
            'address.complement' => ['nullable', 'string', 'max:255'],
            'address.district' => ['required', 'string', 'max:255'],
            'address.city' => ['required', 'string', 'max:255'],
            'address.state' => ['required', 'string', 'size:2'],
        ];
    }

    public function attributes()
    {
        return [
            'cpf' => 'CPF',
            'license_number' => 'número da CNH',
            'license_issuing_state' => 'estado emissor da CNH',
            'address.street' => 'rua',
            'address.number' => 'número',
            'address.zip_code' => 'CEP',
            'address.complement' => 'complemento',
            'address.district' => 'bairro',
            'address.city' => 'cidade',
            'address.state' => 'estado',
        ];
    }
}
