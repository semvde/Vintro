<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use App\Models\Vacancy;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'onboarded'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // JWT REQUIRED METHODS

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // RELATIES

    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'user_id');
    }

    public function cv()
    {
        return $this->hasOne(Cv::class);
    }

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class);
    }

    public function onboardingSessions()
    {
        return $this->hasMany(OnboardingSession::class);
    }
}
