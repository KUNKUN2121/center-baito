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
        Schema::create('shift_change_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shift_id');
            $table->unsignedBigInteger('requester_user_id'); // 変更をリクエストしたユーザー
            $table->unsignedBigInteger('substitute_user_id'); // 代わりにシフトに入るユーザー
            $table->unsignedBigInteger('approver_user_id')->nullable(); // 承認者（アルバイトリーダーなど）
            $table->enum('status', ['pending', 'approved', 'rejected', 'canceled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_change_requests');
    }
};
