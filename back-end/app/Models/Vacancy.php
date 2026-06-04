<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'salary',
        'company',
        'location',
        'employment_type',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
