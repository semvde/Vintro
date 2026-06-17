<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InterviewFeedback extends Model
{
    use HasFactory;

    protected $table = 'interview_feedback';

    protected $fillable = [
        'interview_id',
        'ai_feedback',
        'accepted',
    ];

    protected $casts = [
        'accepted' => 'boolean',
    ];

    public function interview()
    {
        return $this->belongsTo(Interview::class);
    }
}
