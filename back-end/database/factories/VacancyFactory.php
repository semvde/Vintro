<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VacancyFactory extends Factory
{
    public function definition(): array
    {
        $employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'temporary'];

        return [
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraphs(3, true),
            'salary' => fake()->numberBetween(30000, 90000),
            'company' => fake()->company(),
            'location' => fake()->city(),
            'employment_type' => fake()->randomElement($employmentTypes),
        ];
    }
}