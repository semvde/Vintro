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
        'chat_history',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'current_step' => 'integer',
        'max_steps' => 'integer',
        'chat_history' => 'array',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}