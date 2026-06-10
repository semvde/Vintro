<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestVintroSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'onboarded' => true,
            ]
        );

        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => 'Test User',
                'age' => 18,
                'education_level' => [
                    [
                        'degree' => 'MBO',
                        'school' => 'ROC Testschool',
                        'status' => 'bezig',
                        'period' => '2024 - heden',
                    ],
                ],
                'skills' => ['klantvriendelijkheid', 'samenwerken', 'communicatie'],
                'work_experience' => [
                    [
                        'company' => 'Jumbo',
                        'period' => '2023 - 2024',
                        'job_title' => 'Vakkenvuller',
                        'description' => 'Vakken vullen, klanten helpen en de winkel netjes houden.',
                    ],
                ],
                'interests' => ['retail', 'klanten helpen', 'techniek'],
                'strengths' => ['leergierig', 'betrouwbaar', 'sociaal'],
                'job_preferences' => ['bijbaan', 'retail', 'klantenservice'],
                'profile_summary' => 'Ik ben een leergierige en betrouwbare student die graag met mensen werkt. Ik heb ervaring in de supermarkt en vind het belangrijk om klanten goed te helpen.',
            ]
        );

        Vacancy::updateOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Winkelmedewerker',
                'company' => 'Albert Heijn',
            ],
            [
                'description' => 'Je helpt klanten, vult schappen bij en zorgt dat de winkel netjes blijft.',
                'salary' => 12,
                'location' => 'Utrecht',
                'employment_type' => 'part-time',
            ]
        );

        Vacancy::updateOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Klantenservice Medewerker',
                'company' => 'Coolblue',
            ],
            [
                'description' => 'Je helpt klanten met vragen via telefoon en chat en denkt mee over oplossingen.',
                'salary' => 14,
                'location' => 'Rotterdam',
                'employment_type' => 'part-time',
            ]
        );
    }
}