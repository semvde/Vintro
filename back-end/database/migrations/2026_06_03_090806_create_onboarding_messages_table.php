<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('onboarding_messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('onboarding_session_id')
                ->constrained('onboarding_sessions')
                ->cascadeOnDelete();

            $table->string('role', 50);

            $table->longText('content');

            $table->unsignedInteger('step')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboarding_messages');
    }
};
