<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 5 users
        $users = User::factory(5)->create();

        // Each user gets 15 vacancies = 75 total
        foreach ($users as $user) {
            Vacancy::factory()
                ->count(15)
                ->create([
                    'user_id' => $user->id,
                ]);
        }
    }
}
