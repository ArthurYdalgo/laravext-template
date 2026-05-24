<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        $data['payment_methods'] = $this->whenLoaded('paymentMethods', function () {
            return $this->paymentMethods->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'tag' => $method->tag,
                    'amount' => $method->pivot->amount,
                ];
            });
        });

        return $data;
    }
}
