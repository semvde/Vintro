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
    ];

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'video_category',
            'video_id',
            'category_id'
        );
    }
}
