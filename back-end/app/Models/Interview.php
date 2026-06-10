<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'vacancy_id',
        'current_step',
        'chat_history',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'current_step' => 'integer',
        'chat_history' => 'array',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function feedback()
    {
        return $this->hasOne(InterviewFeedback::class);
    }
}
