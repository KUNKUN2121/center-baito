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
        Schema::create('shift_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shift_id');
            $table->unsignedBigInteger('actor_id'); // 変更したユーザー
            $table->enum('action', ['created', 'updated', 'deleted', 'swapped']);
            $table->json('changes')->nullable(); // 変更内容の詳細
            $table->text('note')->nullable(); // 任意のメモ

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_histories');
    }
};
