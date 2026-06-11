<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            $table->unsignedInteger('current_step')->default(0)->after('vacancy_id');
            $table->json('chat_history')->nullable()->after('current_step');
            $table->boolean('completed')->default(false)->after('chat_history');
            $table->timestamp('completed_at')->nullable()->after('completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            $table->dropColumn([
                'current_step',
                'chat_history',
                'completed',
                'completed_at',
            ]);
        });
    }
};