<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\FormRequest;

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
        $customer = $this->route('customer');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:customers,email,'.$customer->id],
            'cpf' => ['sometimes', 'string', 'max:30', 'unique:customers,cpf,'.$customer->id],
            'birthday' => ['sometimes', 'date'],
            'license_number' => ['sometimes', 'string', 'unique:customers,license_number,'.$customer->id],
            'license_issuing_state' => ['sometimes', 'string', 'size:2'],
            'address' => ['sometimes', 'array'],
            'address.street' => ['sometimes', 'string', 'max:255', 'required_with:address'],
            'address.number' => ['sometimes', 'string', 'max:30', 'required_with:address'],
            'address.zip_code' => ['sometimes', 'string', 'max:20', 'required_with:address'],
            'address.complement' => ['nullable', 'string', 'max:255', 'required_with:address'],
            'address.district' => ['sometimes', 'string', 'max:255', 'required_with:address'],
            'address.city' => ['sometimes', 'string', 'max:255', 'required_with:address'],
            'address.state' => ['sometimes', 'string', 'size:2', 'required_with:address'],
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
