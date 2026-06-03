<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VacancyFeedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'vacancy_id',
        'user_id',
        'ai_feedback',
        'motivation_letter',
        'accepted',
    ];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }
}
