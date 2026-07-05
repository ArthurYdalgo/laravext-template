<?php

namespace App\Traits;

use App\Models\Phone;

trait HasPhones
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function phones()
    {
        return $this->morphMany(Phone::class, 'model');
    }

    public function phone(){
        return $this->morphOne(Phone::class, 'model');
    }

    /**
     * Stores a model's phone
     * 
     * @param string $number
     * 
     * @return App\Models\Phone
     */
    public function setPhone($number, $country_code = null, $country_calling_code = null){
        $phone = $this->phone()->updateOrCreate([], compact('number', 'country_code', 'country_calling_code'));

        return $phone;
    }

}
