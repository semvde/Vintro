<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cv extends Model
{
    use HasFactory;

    protected $table = 'cvs';
    protected $fillable = [
        'user_id',
        'phone_number',
        'email',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function versions()
    {
        return $this->hasMany(CvVersion::class);
    }
}
