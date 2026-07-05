<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phone extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'model_type',
        'country_calling_code',
        'country_code',
        'number',
    ];

    protected $hidden = [
        'model_id',
        'model_type',
    ];

    #region Relationships
    public function model()
    {
        return $this->morphTo();
    }

}
