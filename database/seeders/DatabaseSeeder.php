<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(6)->create();

        User::factory()->create([
            'name' => '管理者 Admin',
            'email' => 'admin@admin.com',
            'role_id' => 1,
            'is_active' => true,
            'password' => Hash::make('admin12345'),
        ]);
    }
}
