<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'image',
        'skills',
        'work_experience',
        'education_level',
        'preferred_language',
        'age',
        'interests',
        'strengths',
        'job_preferences',
        'profile_summary',
    ];

    protected $casts = [
        'skills' => 'array',
        'work_experience' => 'array',
        'education_level' => 'array',
        'interests' => 'array',
        'strengths' => 'array',
        'job_preferences' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
