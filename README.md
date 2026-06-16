# 👜 Vintro

Practice a complete job interview and find your new job with Vintro!

🌐 Check out the live version: NOT AVAILABLE YET

<details>
    <summary>Table of Contents</summary>
    <ol>
        <li><a href="#information_source-about-this-project">About this project</a></li>
        <li><a href="#sparkles-functionality">Functionality</a></li>
        <li>
            <a href="#rocket-getting-started">Getting started</a>
            <ol>
                <li><a href="#requirements">Requirements</a></li>
                <li><a href="#installation">Installation</a></li>
            </ol>
        </li>
        <li>
            <a href="#hammer_and_wrench-how-does-it-work">How does it work?</a>
            <ol>
                <li><a href="#technologies">Technologies</a></li>
                <li><a href="#entity-relationship-diagram">Entity Relationship Diagram</a></li>
                <li><a href="#usage">Usage</a></li>
            </ol>
        </li>
        <li><a href="#flying_saucer-deployment">Deployment</a></li>
        <li><a href="#scroll-license">License</a></li>
    </ol>
</details>

[![efeg312](https://img.shields.io/badge/-efeg312-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/efeg312)
[![jeff9912](https://img.shields.io/badge/-jeff9912-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jeff9912)
[![lisa-mao](https://img.shields.io/badge/-lisa--mao-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lisa-mao)
[![Quinten-1074726](https://img.shields.io/badge/-Quinten--1074726-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Quinten-1074726)
[![semvde](https://img.shields.io/badge/-semvde-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/semvde)
[![ThijsVanLoo1](https://img.shields.io/badge/-ThijsVanLoo1-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ThijsVanLoo1)

## :information_source: About this project

Vintro is the app for practicing the complete job interview process! Make a CV in very easy steps, write a motivation
letter, conduct a job interview and get help and feedback along the way from Victoria - your personal job coach!

This project was created for the fourth Tailored Learning Environment (Year 2) at Rotterdam University of Applied
Sciences. The goal of the project was to create a start-up from scratch: from finding a problem in Rotterdam, to
creating the solution.

## :sparkles: Functionality

### CV

- Generate a complete CV with ease
- Edit your CV with an easy interface

### Motivation Letter

- View a list of tailored (fake) vacancies you can apply for
- Get feedback on your motivation letters

### Interview

- Practice a complete interview based on the original vacancy
- Get feedback about the whole interview and see if you had been accepted if it were for real

## :rocket: Getting started

Below are the instructions on how to get the project running on your local machine!

### Requirements

- Node.js & NPM (Front- and Back-end)
- PHP 8.2+ (Back-end)
- Composer (Back-end)
- SQLite (Back-end)

### Installation

1. Clone the repository

```sh
git clone https://github.com/semvde/Vintro.git vintro
cd vintro
```

2. Setup dependencies, environment and front-end assets

- Copy and paste the following contents into a .env file (inside the front-end folder):

```dotenv
VITE_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000/api
```

- Run the following commands (inside the front-end folder):

```sh
npm i
```

- Copy and paste the following contents into a .env file (inside the back-end folder):

```dotenv
ELEVENLABS_API_KEY=YOUR_EL_API_KEY
ELEVENLABS_VOICE_ID=YOUR_AL_VOICE_ID

HF_TTS_MODEL=OpenMOSS-Team/MOSS-TTS-v1.5
HF_TOKEN=YOUR_HUGGING_FACE_TOKEN
HF_MODEL=Qwen/Qwen3.6-35B-A3B
```

- Run the following commands (inside the back-end folder):

```sh
composer i
php artisan migrate:fresh
php artisan jwt:secret
```

3. Setup local test server

```sh
npm run dev (front-end folder)
php artisan serve (back-end folder)
```

- View the website by going to http://localhost:5173

## :hammer_and_wrench: How does it work?

Below you can find the documentation of Vintro!

### Technologies

Vintro uses the following technologies:

#### Front-end:

- [![React][React.com]][React-url]
- [![Tailwind CSS][TailwindCSS.com]][TailwindCSS-url]
- [![JavaScript][JavaScript.com]][JavaScript-url]

#### Back-end:

- [![Laravel][Laravel.com]][Laravel-url]

### Entity Relationship Diagram

![ERD](https://github.com/semvde/Vintro/blob/main/erd.png)

### Usage

The front-end is a Vite + React front-end for Vintro. The app is structured around routes, layouts, shared components,
and a small service layer for API communication.

#### Project structure (important files) for front-end

- `src/main.jsx` initializes the React app.
- `src/App.jsx` defines the main route structure and page flow.
- `src/layouts/` contains layout wrappers:
    - `Layout.jsx` for public pages
    - `UserLayout.jsx` for authenticated app pages
    - `OnboardLayout.jsx` for onboarding
- `src/pages/` contains pages used for the app.
- `src/pages/account/` contains pages related to account.
- `src/pages/cv/` contains pages related to cv.
- `src/components/` contains reusable UI components (cards, buttons, toggles, sliders, form fields, etc.).
- `src/components/ProtectedRoute.jsx` handles route protection for authenticated sections.
- `src/Contexts.jsx` manages shared client-side state via React Context.
- `src/services/Fetch.js` centralizes API requests and should remain the single source for fetch logic.

#### Back-end

For more information on the back-end, check the back-end
README [here](https://github.com/semvde/Vintro/blob/main/back-end/README.md).

## :flying_saucer: Deployment

Vintro has been deployed on a VPS provided by Rotterdam University of Applied Sciences that is running Ubuntu with
Nginx. [These](https://github.com/HR-CMGT/PRG06-2025-2026/tree/main/guides/deployment-react-vite) instructions where
used to deploy the project.

## :scroll: License

The source code in this repository is licensed under the MIT License.


[React.com]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black

[React-url]: https://reactjs.org

[TailwindCSS.com]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

[TailwindCSS-url]: https://tailwindcss.com

[JavaScript.com]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black

[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white

[Laravel-url]: https://laravel.com