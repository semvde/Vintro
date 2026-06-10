<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VacancyFeedback extends Model
{
    use HasFactory;

    protected $table = 'vacancy_feedback';

    protected $fillable = [
        'user_id',
        'vacancy_id',
        'ai_feedback',
        'motivation_letter',
        'accepted',
    ];

    protected $casts = [
        'accepted' => 'boolean',
    ];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}