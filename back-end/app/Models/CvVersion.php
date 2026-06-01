<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CvVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'cv_id',
        'version',
        'pdf_path',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
