<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasAddresses;
use App\Traits\HasMedia;
use App\Traits\HasPhones;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasMedia, HasAddresses, HasPhones, HasApiTokens, TwoFactorAuthenticatable, PasskeyAuthenticatable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'google_id',
        'google_token',
        'google_refresh_token',
        'password',
        'birthday',
        'confirmation_code',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'first_name',
        'last_name'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birthday' => 'date',
            'password' => 'hashed',
            'google_token' => 'encrypted',
            'google_refresh_token' => 'encrypted',
        ];
    }

    #region Relationships
    public function uploadedMedia()
    {
        return $this->hasMany(Media::class, 'uploader_id');
    }

    #regions Getters and Setters
    public function getFirstNameAttribute()
    {
        return explode(' ', $this->name)[0] ?? null;
    }

    public function getLastNameAttribute()
    {
        $parts = explode(' ', $this->name);

        if (count($parts) <= 1) {
            return null;
        }

        return $parts[count($parts) - 1];
    }
}
