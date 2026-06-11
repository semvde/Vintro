<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'video_url',
        'duration_seconds',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
