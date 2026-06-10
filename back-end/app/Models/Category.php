<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $table = 'Category';

    protected $fillable = [
        'name',
        'description',
    ];

    public function videos()
    {
        return $this->hasMany(Video::class);
    }
}
