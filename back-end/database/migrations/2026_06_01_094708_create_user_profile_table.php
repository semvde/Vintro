<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  
    public function up(): void
    {
        Schema::create('user_profile', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('image')->nullable();
            $table->json('skills')->nullable();
            $table->json('work_experience')->nullable();
            $table->json('education_level')->nullable();
            $table->string('preferred_language');
            $table->unsignedTinyInteger('age')->nullable();
            $table->json('interests')->nullable();
            $table->json('strengths')->nullable();
            $table->json('job_preferences')->nullable();

            $table->longText('profile_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profile');
    }
};
