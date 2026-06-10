<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'age' => fake()->numberBetween(16, 25),
            'preferred_language' => 'nl',

            'skills' => [
                'communicatie',
                'samenwerken',
                'klantvriendelijkheid',
            ],

            'work_experience' => [
                [
                    'company' => 'Jumbo',
                    'period' => '2023 - 2024',
                    'job_title' => 'Vakkenvuller',
                    'description' => 'Klanten helpen, schappen vullen en de winkel netjes houden.',
                ],
            ],

            'education_level' => [
                [
                    'degree' => 'MBO',
                    'school' => 'ROC Utrecht',
                    'status' => 'bezig',
                    'period' => '2024 - heden',
                ],
            ],

            'interests' => [
                'retail',
                'klanten helpen',
                'techniek',
            ],

            'strengths' => [
                'leergierig',
                'betrouwbaar',
                'sociaal',
            ],

            'job_preferences' => [
                'bijbaan',
                'retail',
                'klantenservice',
            ],

            'profile_summary' => 'Ik ben een leergierige en betrouwbare student die graag met mensen werkt. Ik heb ervaring in de supermarkt en vind het belangrijk om klanten goed te helpen.',
        ];
    }
}