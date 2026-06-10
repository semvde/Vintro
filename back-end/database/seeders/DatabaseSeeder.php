<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'onboarded' => true,
        ]);

        UserProfile::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'age' => 18,

            'education_level' => [
                [
                    'degree' => 'MBO',
                    'school' => 'ROC Utrecht',
                    'status' => 'bezig',
                    'period' => '2024-heden',
                ]
            ],

            'skills' => [
                'communicatie',
                'samenwerken',
                'klantvriendelijkheid',
            ],

            'work_experience' => [
                [
                    'company' => 'Jumbo',
                    'period' => '2023-2024',
                    'job_title' => 'Vakkenvuller',
                    'description' => 'Klanten helpen en vakken vullen.',
                ]
            ],

            'interests' => [
                'retail',
                'techniek',
            ],

            'strengths' => [
                'leergierig',
                'betrouwbaar',
            ],

            'job_preferences' => [
                'retail',
                'klantenservice',
            ],

            'profile_summary' =>
                'Leergierige student met ervaring in retail.',
        ]);

        Vacancy::create([
            'user_id' => $user->id,
            'title' => 'Winkelmedewerker',
            'description' =>
                'Je helpt klanten, vult schappen en zorgt dat de winkel netjes blijft.',
            'salary' => 14,
            'company' => 'Albert Heijn',
            'location' => 'Utrecht',
            'employment_type' => 'part-time',
        ]);
    }
}