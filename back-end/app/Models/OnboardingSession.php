<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OnboardingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'current_step',
        'max_steps',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'current_step' => 'integer',
        'max_steps' => 'integer',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function messages()
    {
        return $this->hasMany(OnboardingMessage::class);
    }
}