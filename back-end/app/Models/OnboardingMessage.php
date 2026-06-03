<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OnboardingMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'onboarding_session_id',
        'role',
        'content',
        'step',
    ];

    protected $casts = [
        'step' => 'integer',
    ];

    public function session()
    {
        return $this->belongsTo(OnboardingSession::class, 'onboarding_session_id');
    }
}