# VINTRO Backend API Endpoints

## Inhoudsopgave

* [Base URL](#base-url)
* [Huidige API Routes Overzicht](#huidige-api-routes-overzicht)
* [Auth Endpoints](#auth-endpoints)

    * [Register](#register)
    * [Login](#login)
    * [Get Current User](#get-current-user)
    * [Logout](#logout)

* [Onboarding Endpoints](#onboarding-endpoints)

    * [Start Onboarding](#start-onboarding)
    * [Onboarding Chat](#onboarding-chat)

* [Profile Endpoints](#profile-endpoints)

    * [Get Profile](#get-profile)
    * [Update Profile](#update-profile)
    * [Generate Profile](#generate-profile)

* [Vacancies Endpoints](#vacancies-endpoints)

    * [Get Vacancies](#get-vacancies)
    * [Get Vacancy](#get-vacancy)
    * [Generate Vacancies](#generate-vacancies)

* [Vacancy Feedback Endpoints](#vacancy-feedback-endpoints)

    * [Get Vacancy Feedbacks](#get-vacancy-feedbacks)
    * [Get Vacancy Feedback](#get-vacancy-feedback)

* [Interview Feedback Endpoints](#interview-feedback-endpoints)

    * [Get Interview Feedbacks](#get-interview-feedbacks)
    * [Get Interview Feedback](#get-interview-feedback)

* [Text-to-Speech Endpoint](#text-to-speech-endpoint)

    * [Generate Speech](#generate-speech)

* [Videos Endpoints](#videos-endpoints)
    * [Get Videos](#get-videos)
    * [Get Video](#get-video)

* [Categories Endpoints](#categories-endpoints)
    * [Get Categories](#get-categories)
    * [Get Category](#get-category)

* [Frontend Notes](#frontend-notes)

---

## Base URL

Online (live):

```
http://145.24.223.123:8000/
```

Base URL lokaal:

```
http://127.0.0.1:8000/api
```

Gebruik bij JSON requests altijd deze headers:

```
Accept: application/json
Content-Type: application/json
```

---

## Huidige API Routes Overzicht

```txt
http://127.0.0.1:8000/api/onboarding/start
```

## Huidige API routes overzicht

| Method | Endpoint                   | Beschrijving                                             | Auth nodig |
|--------|----------------------------|----------------------------------------------------------|------------|
| POST   | `/register`                | Nieuwe gebruiker registreren                             | Nee        |
| POST   | `/login`                   | Gebruiker inloggen                                       | Nee        |
| GET    | `/user`                    | Ingelogde gebruiker ophalen                              | Ja         |
| POST   | `/logout`                  | Gebruiker uitloggen                                      | Ja         |
| GET    | `/onboarding/start`        | Startbericht onboarding ophalen                          | Ja         |
| POST   | `/onboarding/chat`         | Onboarding-chat met Victoria                             | Ja         |
| GET    | `/profile`                 | Profiel en CV ophalen                                    | Ja         |
| PUT    | `/profile`                 | Profiel en CV bijwerken                                  | Ja         |
| POST   | `/profile/generate`        | Genereert user_profile op basis van afgeronde onboarding | Ja         |
| GET    | `/vacancies`               | Alle vacatures van gebruiker ophalen                     | Ja         |
| GET    | `/vacancies/{id}`          | Specifieke vacature ophalen                              | Ja         |
| POST   | `/vacancies/generate`      | Genereert 15 oefenvacatures op basis van profiel         | Ja         |
| GET    | `/vacancy-feedback`        | Alle vacancy feedback opgehaald                          | Ja         |
| GET    | `/vacancy-feedback/{id}`   | Specifieke vacancy feedback ophalen                      | Ja         |
| GET    | `/interview-feedback`      | Alle interview feedback ophalen                          | Ja         |
| GET    | `/interview-feedback/{id}` | Specifieke interview feedback ophalen                    | Ja         |
| POST   | `/tts`                     | Tekst omzetten naar audio                                | Nee        |
| POST   | `/coach`                   | Algemene coach-chat met Victoria                         | Nee        |    

---

## Auth Endpoints

### Register

Registreert een nieuwe gebruiker.

```http
POST /register
```

Voorbeeld request:

```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

Voorbeeld response:

```json
{
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com"
    },
    "token": "jwt_token_here"
}
```

---

### Login

Logt een bestaande gebruiker in.

```http
POST /login
```

Voorbeeld request:

```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

Voorbeeld response:

```json
{
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com"
    },
    "token": "jwt_token_here"
}
```

Frontend moet deze token opslaan en meesturen bij protected routes.

---

## Protected Auth Endpoints

Voor deze endpoints is een JWT-token nodig.

Header:

```
Authorization: Bearer jwt_token_here
```

### Get Current User

Haalt de ingelogde gebruiker op.

```http
GET /user
```

Voorbeeld response:

```json
{
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
}
```

---

### Logout

Logt de gebruiker uit.

```http
POST /logout
```

Voorbeeld response:

```json
{
    "message": "Successfully logged out"
}
```

---

## Onboarding Endpoints

De onboarding verzamelt informatie voor een werkprofiel, eerste CV en sollicitatie-oefeningen.

### Start Onboarding

```http
GET /onboarding/start
```

Gebruik dit wanneer de gebruiker de onboardingpagina opent.

Voorbeeld response:

```json
{
    "reply": "Hoi Test User, ik ben Victoria. Ik help je stap voor stap om je voor te bereiden op solliciteren. We bouwen eerst een werkprofiel op, zodat we daarna een eerste CV kunnen maken en je sollicitaties kunt oefenen. Om te beginnen: hoe oud ben je?",
    "type": "onboarding_start"
}
```

Frontend flow:

```
1. Gebruiker opent onboardingpagina
2. Frontend roept GET /onboarding/start aan
3. Frontend toont reply als eerste assistant-bericht
```

---

### Onboarding Chat

```http
POST /onboarding/chat
```

Stuurt een antwoord van de gebruiker naar Victoria. De backend slaat de chatgeschiedenis op in
`onboarding_sessions.chat_history`.

Voorbeeld request:

```json
{
    "message": "Ik ben 23 jaar",
    "step": 1
}
```

Velden:

| Field     | Type    | Required | Uitleg                                            |
|-----------|---------|----------|---------------------------------------------------|
| `message` | string  | Ja       | Het nieuwste bericht van de gebruiker             |
| `step`    | integer | Ja       | Huidige onboardingstap, bijgehouden door frontend |

Frontend hoeft geen `history` of `max_steps` mee te sturen. De backend bepaalt zelf wanneer de onboarding klaar is.

Voorbeeld response tijdens onboarding:

```json
{
    "reply": "Wat is je laatste opleiding of schoolervaring?",
    "finished": false,
    "next_action": "continue_onboarding"
}
```

Voorbeeld response wanneer onboarding klaar is:

```json
{
    "reply": "Dankjewel voor je antwoorden. Ik heb genoeg informatie voor je werkprofiel en eerste CV.",
    "finished": true,
    "next_action": "generate_profile"
}
```

Frontend flow:

```
1. Gebruiker stuurt antwoord
2. Frontend verhoogt step
3. Frontend stuurt message en step naar POST /onboarding/chat
4. Frontend toont reply
5. Als finished true is:
   - input blokkeren
   - POST /profile/generate aanroepen
   - daarna door naar CV- of dashboardpagina
```

---

## Profile Endpoints

### Get Profile

Haalt het profiel en CV van de ingelogde gebruiker op.

```http
GET /profile
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": {
        "profile": {
            "id": 1,
            "user_id": 1,
            "name": "Test User",
            "image": "https://example.com/image.jpg",
            "skills": [
                "samenwerken",
                "organiseren",
                "probleemoplossen"
            ],
            "work_experience": [
                {
                    "company": "Jumbo",
                    "period": "september 2023 - juni 2025",
                    "job_title": "Vakkenvuller",
                    "description": "Eerste werkervaring opgedaan in de detailhandel."
                }
            ],
            "education_level": {
                "degree": "HAVO",
                "school": "Openbare HAVO",
                "status": "afgerond"
            },
            "preferred_language": "nl"
        },
        "cv": {
            "id": 1,
            "user_id": 1,
            "phone_number": "+31612345678",
            "email": "test@example.com"
        }
    }
}
```

Frontend flow:

```
1. Gebruiker navigeert naar profielpagina
2. Frontend roept GET /profile aan
3. Frontend toont profile en cv gegevens
4. Gebruiker kan gegevens bijwerken (bijv. via formulier)
```

---

### Update Profile

Werkt het profiel en/of CV bij voor de ingelogde gebruiker.

```http
PUT /profile
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

Voorbeeld request (bijwerken profiel):

```json
{
    "name": "Test User Updated",
    "image": "https://example.com/new-image.jpg",
    "skills": [
        "samenwerken",
        "organiseren",
        "communicatie"
    ],
    "work_experience": [
        {
            "company": "Jumbo",
            "period": "september 2023 - juni 2025",
            "job_title": "Vakkenvuller",
            "description": "Eerste werkervaring opgedaan in de detailhandel."
        },
        {
            "company": "Albert Heijn",
            "period": "juli 2025 - heden",
            "job_title": "Kassier",
            "description": "Werkend als kassier in de kassa-afdeling."
        }
    ],
    "education_level": {
        "degree": "HBO",
        "school": "Universiteit van Amsterdam",
        "status": "in_voorbereiding"
    },
    "preferred_language": "nl",
    "age": 25,
    "interests": [
        "sport",
        "creativiteit"
    ],
    "strengths": [
        "leergierig",
        "ijverig"
    ],
    "job_preferences": [
        "werken met mensen"
    ],
    "profile_summary": "Gemotiveerde professional met ervaring in detailhandel en projectmanagement.",
    "phone_number": "+31687654321",
    "email": "newemail@example.com"
}
```

Voorbeeld request (bijwerken CV-gegevens):

```json
{
    "phone_number": "+31687654321",
    "email": "newemail@example.com"
}
```

Velden voor profiel:

| Field                | Type    | Required | Uitleg                                               |
|----------------------|---------|----------|------------------------------------------------------|
| `name`               | string  | Nee      | Volledige naam van de gebruiker                      |
| `image`              | string  | Nee      | URL naar profielfoto                                 |
| `skills`             | array   | Nee      | Array van vaardigheden (strings)                     |
| `work_experience`    | array   | Nee      | Array van work experience objects met company/period |
| `education_level`    | object  | Nee      | Object met degree, school, status velden             |
| `preferred_language` | string  | Nee      | Voorkeurtaal (bv. 'nl', 'en')                        |
| `age`                | integer | Nee      | Leeftijd van de gebruiker                            |
| `interests`          | array   | Nee      | Array van interesses (strings)                       |
| `strengths`          | array   | Nee      | Array van sterke punten (strings)                    |
| `job_preferences`    | array   | Nee      | Array van werkvoorkeur (strings)                     |
| `profile_summary`    | string  | Nee      | Korte profielsamenvatting (longtext)                 |

Velden voor CV:

| Field          | Type   | Required | Uitleg         |
|----------------|--------|----------|----------------|
| `phone_number` | string | Nee      | Telefoonnummer |
| `email`        | string | Nee      | Email adres    |

Voorbeeld response:

```json
{
    "message": "Profile updated successfully",
    "data": {
        "profile": {
            "id": 1,
            "user_id": 1,
            "name": "Test User Updated",
            "image": "https://example.com/new-image.jpg",
            "skills": [
                "samenwerken",
                "organiseren",
                "communicatie"
            ],
            "work_experience": [
                {
                    "company": "Jumbo",
                    "period": "september 2023 - juni 2025",
                    "job_title": "Vakkenvuller",
                    "description": "Eerste werkervaring opgedaan in de detailhandel."
                },
                {
                    "company": "Albert Heijn",
                    "period": "juli 2025 - heden",
                    "job_title": "Kassier",
                    "description": "Werkend als kassier in de kassa-afdeling."
                }
            ],
            "education_level": {
                "degree": "HBO",
                "school": "Universiteit van Amsterdam",
                "status": "in_voorbereiding"
            },
            "preferred_language": "nl"
        },
        "cv": {
            "id": 1,
            "user_id": 1,
            "phone_number": "+31687654321",
            "email": "newemail@example.com"
        }
    }
}
```

Frontend flow:

```
1. Gebruiker vult profielvorm in (name, skills, etc.)
2. Frontend stuurt PUT /profile met aangepaste gegevens
3. Frontend ontvangt bijgewerkt profiel
4. Frontend toont success bericht en bijgewerkte gegevens
5. Optioneel: redirect naar CV- of dashboardpagina
```

---

### Generate Profile

```http
POST /profile/generate
```

Genereert een `user_profile` op basis van de afgeronde onboarding-chat.

Deze endpoint heeft geen body nodig. De backend gebruikt de ingelogde gebruiker en zoekt automatisch de afgeronde
onboarding session.

Voorbeeld request:

```http
POST /profile/generate
Authorization: Bearer jwt_token_here
Accept: application/json
```

Voorbeeld response:

```json
{
    "message": "Profiel gegenereerd.",
    "profile": {
        "id": 1,
        "user_id": 1,
        "name": "Test User",
        "age": 23,
        "education_level": {
            "degree": "HAVO",
            "school": "onbekend",
            "status": "afgerond",
            "period": "onbekend"
        },
        "skills": [
            "samenwerken",
            "organiseren"
        ],
        "work_experience": [
            {
                "company": "Jumbo",
                "period": "september 2023 - juni 2025",
                "job_title": "Vakkenvuller",
                "description": "Eerste werkervaring opgedaan in de detailhandel."
            }
        ],
        "interests": [
            "sport",
            "creativiteit"
        ],
        "strengths": [
            "leergierig",
            "ijverig"
        ],
        "job_preferences": [
            "werken met mensen"
        ],
        "profile_summary": "Korte profielsamenvatting..."
    },
    "next_action": "generate_cv"
}
```

Frontend flow:

```
1. Wacht tot /onboarding/chat finished true teruggeeft
2. Roep POST /profile/generate aan
3. Gebruik response.profile voor preview, CV-generatie of dashboard
4. Ga daarna door naar CV-pagina of dashboard
```

---

## Vacancies Endpoints

### Get Vacancies

Haalt alle oefenvacatures op voor de ingelogde gebruiker.

```http
GET /vacancies
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "title": "Junior Frontend Developer",
            "company": "Tech Startup XYZ",
            "location": "Amsterdam",
            "employment_type": "full-time",
            "salary": 2500,
            "description": "Wij zoeken een junior frontend developer met kennis van React en Vue.js. Je werkt in een klein, dynamisch team aan innovative projecten.",
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z"
        },
        {
            "id": 2,
            "user_id": 1,
            "title": "Backend Developer",
            "company": "Enterprise Solutions",
            "location": "Rotterdam",
            "employment_type": "full-time",
            "salary": 3200,
            "description": "Wij zoeken een ervaren backend developer met Python en Django kennis.",
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z"
        }
    ]
}
```

Frontend flow:

```
1. Gebruiker navigeert naar vacaturepagina
2. Frontend roept GET /vacancies aan
3. Frontend toont lijst van vacatures
4. Gebruiker kan op vacature klikken voor details
```

---

### Get Vacancy

Haalt de details van één specifieke vacature op.

```http
GET /vacancies/{id}
Authorization: Bearer jwt_token_here
```

URL Parameters:

| Parameter | Type    | Required | Uitleg             |
|-----------|---------|----------|--------------------|
| `id`      | integer | Ja       | ID van de vacature |

Voorbeeld response:

```json
{
    "data": {
        "id": 1,
        "user_id": 1,
        "title": "Junior Frontend Developer",
        "company": "Tech Startup XYZ",
        "location": "Amsterdam",
        "employment_type": "full-time",
        "salary": 2500,
        "description": "Wij zoeken een junior frontend developer met kennis van React en Vue.js. Je werkt in een klein, dynamisch team aan innovative projecten. Vereisten: HTML/CSS, JavaScript, Git.",
        "created_at": "2026-06-09T10:30:00.000000Z",
        "updated_at": "2026-06-09T10:30:00.000000Z"
    }
}
```

Frontend flow:

```
1. Gebruiker klikt op vacature uit lijst
2. Frontend roept GET /vacancies/{id} aan
3. Frontend toont volledige vacaturedetails
4. Gebruiker kan solliciteren of oefening starten
```

---

### Generate Vacancies

Genereert automatisch 15 oefenvacatures op basis van het profiel van de gebruiker. De AI analyseert skills, voorkeur en
ervaring en creëert relevante vacatures.

```http
POST /vacancies/generate
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

Deze endpoint vereist geen request body.

Voorbeeld request:

```http
POST /vacancies/generate
Authorization: Bearer jwt_token_here
Accept: application/json
```

Voorbeeld response:

```json
{
    "message": "15 oefenvacatures aangemaakt.",
    "count": 15,
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "title": "Customer Support Specialist",
            "company": "RetailCo Nederland",
            "location": "Amsterdam",
            "employment_type": "full-time",
            "salary": 2000,
            "description": "Wij zoeken iemand met sterke communicatievaardigheden en organisatievermogen.",
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z"
        },
        {
            "id": 2,
            "user_id": 1,
            "title": "Project Coordinator",
            "company": "BuildTech Solutions",
            "location": "Utrecht",
            "employment_type": "full-time",
            "salary": 2300,
            "description": "Je coördineert projecten en werkt samen met diverse stakeholders.",
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z"
        }
    ]
}
```

Response velden:

| Field     | Type    | Uitleg                                    |
|-----------|---------|-------------------------------------------|
| `message` | string  | Bevestigingsbericht                       |
| `count`   | integer | Aantal gegenereerde vacatures (altijd 15) |
| `data`    | array   | Array van vacature objects                |

Error response (geen profiel):

```json
{
    "message": "Geen profiel gevonden."
}
```

Frontend flow:

```
1. Gebruiker klikt op "Vacatures genereren" knop
2. Frontend roept POST /vacancies/generate aan
3. Backend analyseert user profiel via AI
4. Backend genereert 15 relevante oefenvacatures
5. Frontend toont bevestigingsbericht en vacaturelijst
6. Gebruiker kan nu oefenvacatures beoordelen en sollicitaties oefenen
```

Opmerkingen:

- Vacatures worden gegenereerd op basis van het user profiel (skills, CV, job preferences).
- Dit endpoint genereert altijd precies 15 vacatures.
- De gegenereerde vacatures zijn denkbeeldig en bedoeld voor oefendoeleinden.
- Alle gegenereerde vacatures zijn gekoppeld aan de ingelogde gebruiker.

---

## Vacancy Feedback Endpoints

### Get Vacancy Feedbacks

Haalt alle feedback op voor vacatures van de ingelogde gebruiker.

```http
GET /vacancy-feedback
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": [
        {
            "id": 1,
            "vacancy_id": 1,
            "ai_feedback": "Je motivatie is sterk en je relevante ervaring is duidelijk geformuleerd.",
            "motivation_letter": "Ik ben zeer geïnteresseerd in deze rol omdat...",
            "accepted": true,
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z",
            "vacancy": {
                "id": 1,
                "title": "Junior Frontend Developer",
                "company": "Tech Startup XYZ",
                "location": "Amsterdam",
                "employment_type": "full-time",
                "salary": 2500
            }
        },
        {
            "id": 2,
            "vacancy_id": 2,
            "ai_feedback": "Uitstekende match met de vacature. Je skills aansluiten goed.",
            "motivation_letter": "Met mijn achtergrond in...",
            "accepted": true,
            "created_at": "2026-06-09T11:00:00.000000Z",
            "updated_at": "2026-06-09T11:00:00.000000Z",
            "vacancy": {
                "id": 2,
                "title": "Backend Developer",
                "company": "Enterprise Solutions",
                "location": "Rotterdam",
                "employment_type": "full-time",
                "salary": 3200
            }
        }
    ]
}
```

Frontend flow:

```
1. Gebruiker navigeert naar sollicitatiefeedback pagina
2. Frontend roept GET /vacancy-feedback aan
3. Frontend toont lijst van alle feedback items
4. Feedback bevat AI-beoordeling en gebruiker motivatie
5. Gebruiker kan op item klikken voor details
```

---

### Get Vacancy Feedback

Haalt de details van één specifiek feedback item op.

```http
GET /vacancy-feedback/{id}
Authorization: Bearer jwt_token_here
```

URL Parameters:

| Parameter | Type    | Required | Uitleg                   |
|-----------|---------|----------|--------------------------|
| `id`      | integer | Ja       | ID van het feedback item |

Voorbeeld response:

```json
{
    "data": {
        "id": 1,
        "vacancy_id": 1,
        "ai_feedback": "Je motivatie is sterk en je relevante ervaring is duidelijk geformuleerd. Echter, je zou kunnen uitbreiden op je specifieke technische vaardigheden en hoe deze direct van toepassing zijn.",
        "motivation_letter": "Ik ben zeer geïnteresseerd in deze rol omdat ik graag mijn frontend-vaardigheden wil verder ontwikkelen in een dynamisch team. Mijn ervaring met React en Vue.js biedt een solide basis.",
        "accepted": true,
        "created_at": "2026-06-09T10:30:00.000000Z",
        "updated_at": "2026-06-09T10:30:00.000000Z",
        "vacancy": {
            "id": 1,
            "user_id": 1,
            "title": "Junior Frontend Developer",
            "company": "Tech Startup XYZ",
            "location": "Amsterdam",
            "employment_type": "full-time",
            "salary": 2500,
            "description": "Wij zoeken een junior frontend developer met kennis van React en Vue.js..."
        }
    }
}
```

Response velden:

| Field               | Type    | Uitleg                                    |
|---------------------|---------|-------------------------------------------|
| `id`                | integer | Feedback item ID                          |
| `vacancy_id`        | integer | gekoppelde vacature ID                    |
| `ai_feedback`       | string  | AI gegenereerde beoordeling en suggesties |
| `motivation_letter` | string  | Gebruiker geschreven motivatiebrief       |
| `accepted`          | boolean | Of de sollicitatie werd geaccepteerd      |
| `vacancy`           | object  | Volledige vacature object                 |

Frontend flow:

```
1. Gebruiker klikt op feedback item uit lijst
2. Frontend roept GET /vacancy-feedback/{id} aan
3. Frontend toont volledige feedback details
4. Gebruiker kan AI-feedback lezen en verbeteringen aanpassen
5. Optioneel: feedback opslaan of opnieuw indienen
```

---

## Interview Feedback Endpoints

### Get Interview Feedbacks

Haalt alle interview feedback op voor de ingelogde gebruiker.

```http
GET /interview-feedback
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": [
        {
            "id": 1,
            "interview_id": 1,
            "ai_feedback": "Je antwoorden waren goed gestructureerd. Zorg ervoor dat je meer voorbeelden geeft van je werkervaring.",
            "accepted": true,
            "created_at": "2026-06-09T12:00:00.000000Z",
            "updated_at": "2026-06-09T12:00:00.000000Z",
            "interview": {
                "id": 1,
                "vacancy_id": 1
            }
        },
        {
            "id": 2,
            "interview_id": 2,
            "ai_feedback": "Sterke voorbereiding zichtbaar. Je communicatie was duidelijk en professioneel.",
            "accepted": true,
            "created_at": "2026-06-09T13:00:00.000000Z",
            "updated_at": "2026-06-09T13:00:00.000000Z",
            "interview": {
                "id": 2,
                "vacancy_id": 2
            }
        }
    ]
}
```

Frontend flow:

```
1. Gebruiker navigeert naar interview feedback pagina
2. Frontend roept GET /interview-feedback aan
3. Frontend toont lijst van alle interview feedback items
4. Gebruiker kan op item klikken voor gedetailleerde feedback
```

---

### Get Interview Feedback

Haalt de details van één specifieke interview feedback op.

```http
GET /interview-feedback/{id}
Authorization: Bearer jwt_token_here
```

URL Parameters:

| Parameter | Type    | Required | Uitleg                   |
|-----------|---------|----------|--------------------------|
| `id`      | integer | Ja       | ID van het feedback item |

Voorbeeld response:

```json
{
    "data": {
        "id": 1,
        "interview_id": 1,
        "ai_feedback": "Je antwoorden waren goed gestructureerd met concrete voorbeelden. Punten ter verbetering: zorg ervoor dat je meer je eigen rol in teamprojecten benadrukt. Je non-verbale communicatie was open en vriendelijk. Zorg ervoor dat je vragen stelt aan het einde van het interview om je interesse aan te tonen.",
        "accepted": true,
        "created_at": "2026-06-09T12:00:00.000000Z",
        "updated_at": "2026-06-09T12:00:00.000000Z",
        "interview": {
            "id": 1,
            "vacancy_id": 1
        }
    }
}
```

Response velden:

| Field          | Type    | Uitleg                                  |
|----------------|---------|-----------------------------------------|
| `id`           | integer | Feedback item ID                        |
| `interview_id` | integer | gekoppelde interview ID                 |
| `ai_feedback`  | string  | AI gegenereerde beoordeling en feedback |
| `accepted`     | boolean | Of de interview goed is gegaan          |
| `interview`    | object  | Interview object met vacancy_id         |

Frontend flow:

```
1. Gebruiker klikt op interview feedback item
2. Frontend roept GET /interview-feedback/{id} aan
3. Frontend toont gedetailleerde AI feedback
4. Gebruiker kan feedback lezen en punten ter verbetering opnemen
5. Optioneel: interview opnieuw volgen of naar volgende stap
```

---

## Text-to-Speech Endpoint

### Generate Speech

Zet tekst om naar audio. Deze endpoint geeft een `audio/wav` response terug.

```http
POST /tts
```

Voorbeeld request:

```json
{
    "text": "Hoi, ik ben VINTRO. Ik help je stap voor stap.",
    "voice": "af_heart"
}
```

Velden:

| Field   | Type   | Required | Uitleg                                |
|---------|--------|----------|---------------------------------------|
| `text`  | string | Ja       | De tekst die uitgesproken moet worden |
| `voice` | string | Nee      | Steminstelling voor het TTS-model     |

Response:

```
Content-Type: audio/wav
```

Frontend voorbeeld:

```js
const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "audio/wav",
    },
    body: JSON.stringify({
        text: "Hoi, ik ben VINTRO.",
        voice: "af_heart",
    }),
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

---

## Videos Endpoints

### Get Videos

GET /videos

```http
GET /interview-feedback
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": [
        {
            "id": 1,
            "interview_id": 1,
            "ai_feedback": "Je antwoorden waren goed gestructureerd. Zorg ervoor dat je meer voorbeelden geeft van je werkervaring.",
            "accepted": true,
            "created_at": "2026-06-09T12:00:00.000000Z",
            "updated_at": "2026-06-09T12:00:00.000000Z",
            "interview": {
                "id": 1,
                "vacancy_id": 1
            }
        },
        {
            "id": 2,
            "interview_id": 2,
            "ai_feedback": "Sterke voorbereiding zichtbaar. Je communicatie was duidelijk en professioneel.",
            "accepted": true,
            "created_at": "2026-06-09T13:00:00.000000Z",
            "updated_at": "2026-06-09T13:00:00.000000Z",
            "interview": {
                "id": 2,
                "vacancy_id": 2
            }
        }
    ]
}
```

## Frontend Notes

- Alle endpoints beginnen met `/api`. Voor lokale development is de volledige URL bijvoorbeeld:

```
http://127.0.0.1:8000/api/onboarding/start
```

- Protected routes hebben deze header nodig:

```
Authorization: Bearer jwt_token_here
```

- Onboarding werkt met een vaste flow vanuit frontend:
    - `GET /onboarding/start`
    - daarna meerdere keren `POST /onboarding/chat`
    - als `finished: true`, doorgaan naar profiel/CV-scherm.

- TTS geeft geen JSON terug maar audio. Gebruik daarom `response.blob()` in de frontend.
