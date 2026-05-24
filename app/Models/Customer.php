<?php

namespace App\Models;

use App\Traits\HasAddresses;
use App\Traits\HasPhones;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory;
    use HasPhones, HasAddresses, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'birthday',
        'cpf',
        'license_number',
        'license_issuing_state',
    ];

    protected $appends = [
        'first_name',
    ];

    protected function casts(): array
    {
        return [
            'birthday' => 'date'
        ];
    }

    #region Relationships
    public function rentals(){
        return $this->hasMany(Rental::class);
    }

    public function vehicles(){
        return $this->belongsToMany(Vehicle::class, 'rentals');
    } 

    #region Getters and Setters
    public function getFirstNameAttribute() {
        return explode(' ', $this->name)[0];
    }
}
