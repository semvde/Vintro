# VINTRO Backend API Endpoints

## Inhoudsopgave

- [Base URL](#base-url)
- [Huidige API Routes Overzicht](#huidige-api-routes-overzicht)
- [Auth Endpoints](#auth-endpoints)
    - [Register](#register)
    - [Login](#login)
    - [Get Current User](#get-current-user)
    - [Logout](#logout)

- [Onboarding Endpoints](#onboarding-endpoints)
    - [Start Onboarding](#start-onboarding)
    - [Onboarding Chat](#onboarding-chat)

- [Profile Endpoints](#profile-endpoints)
    - [Get Profile](#get-profile)
    - [Update Profile](#update-profile)
    - [Generate Profile](#generate-profile)

- [Vacancies Endpoints](#vacancies-endpoints)
    - [Get Vacancies](#get-vacancies)
    - [Get Vacancy](#get-vacancy)
    - [Generate Vacancies](#generate-vacancies)

- [Vacancy Feedback Endpoints](#vacancy-feedback-endpoints)
    - [Get Vacancy Feedbacks](#get-vacancy-feedbacks)
    - [Get Vacancy Feedback](#get-vacancy-feedback)

- [Interview Feedback Endpoints](#interview-feedback-endpoints)
    - [Get Interview Feedbacks](#get-interview-feedbacks)
    - [Get Interview Feedback](#get-interview-feedback)

* [Vacancies Endpoints](#vacancy-endpoints)
  * [Get Vacancies](#get-vacancies)
  * [Get Vacancy](#get-vacancy)
  * [Generate Vacancies](#generate-vacancies)

* [Motivation Letter Feedback](#motivation-letter-feedback)

  * [Generate Feedback](#generate-feedback)
  * [Get Feedback](#get-feedback)

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
| ------ | -------------------------- | -------------------------------------------------------- | ---------- |
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
| GET    | `/interviews/{id}/start`   | Begin de Interview                                       | Ja         |
| POST   | `/interviews/{id}/chat `   | Berichtjes naar interview                                | Ja         |
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
| --------- | ------- | -------- | ------------------------------------------------- |
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
            "skills": ["samenwerken", "organiseren", "probleemoplossen"],
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
    "skills": ["samenwerken", "organiseren", "communicatie"],
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
    "interests": ["sport", "creativiteit"],
    "strengths": ["leergierig", "ijverig"],
    "job_preferences": ["werken met mensen"],
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
| -------------------- | ------- | -------- | ---------------------------------------------------- |
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
| -------------- | ------ | -------- | -------------- |
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
            "skills": ["samenwerken", "organiseren", "communicatie"],
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
        "skills": ["samenwerken", "organiseren"],
        "work_experience": [
            {
                "company": "Jumbo",
                "period": "september 2023 - juni 2025",
                "job_title": "Vakkenvuller",
                "description": "Eerste werkervaring opgedaan in de detailhandel."
            }
        ],
        "interests": ["sport", "creativiteit"],
        "strengths": ["leergierig", "ijverig"],
        "job_preferences": ["werken met mensen"],
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

## Vacancy Endpoints

### Alle vacatures ophalen

```http
GET /vacancies
```

Geeft alle vacatures terug die aan de ingelogde gebruiker gekoppeld zijn.

Voorbeeld response:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Winkelmedewerker",
      "company": "Albert Heijn",
      "location": "Utrecht",
      "employment_type": "part-time",
      "salary": 14,
      "description": "Je helpt klanten, vult schappen en zorgt dat de winkel netjes blijft."
    }
  ]
}
```

---

### Eén vacature ophalen

```http
GET /vacancies/{id}
```

Geeft de details van één specifieke vacature terug.

Voorbeeld:

```http
GET /vacancies/1
```

---

### Vacatures genereren

```http
POST /vacancies/generate
```

Laat Victoria 15 oefenvacatures genereren op basis van het gebruikersprofiel.

Voorbeeld response:

```json
{
  "message": "15 oefenvacatures aangemaakt.",
  "count": 15,
  "data": [...]
}
```

---

# Motivatiebrief Feedback

Gebruikers kunnen een motivatiebrief schrijven voor een vacature.

Victoria analyseert:

- de vacature
- het gebruikersprofiel
- de motivatiebrief

Daarna wordt feedback gegenereerd en opgeslagen in de `vacancy_feedback` tabel.

De feedback bevat:

- algemene reactie
- sterke punten
- verbeterpunten
- suggesties vanuit het profiel/CV
- een verbeterde voorbeeldbrief
- een beoordeling (`accepted`)

---

## Feedback genereren

```http
POST /vacancy-feedback
```

Slaat een motivatiebrief op en genereert direct AI-feedback.

Request:

```json
{
  "vacancy_id": 1,
  "motivation_letter": "Beste Albert Heijn, ik wil graag bij jullie werken omdat..."
}
```

Voorbeeld response:

```json
{
  "message": "Motivatiebrief opgeslagen en feedback gegenereerd.",
  "data": {
    "id": 1,
    "vacancy_id": 1,
    "motivation_letter": "Beste Albert Heijn...",
    "ai_feedback": {
      "reaction": "Je hebt een goede basis gelegd.",
      "good_points": [
        "Je motivatie is duidelijk."
      ],
      "improvement_points": [
        "Maak de brief persoonlijker."
      ],
      "profile_suggestions": [
        "Uit je profiel blijkt dat je ervaring hebt als vakkenvuller bij Jumbo. Dit kun je benoemen."
      ],
      "improved_example": "Beste Albert Heijn..."
    },
    "accepted": false
  }
}
```

---

## Feedback ophalen

```http
GET /vacancies/{vacancy}/feedback
```

Haalt de laatst opgeslagen feedback voor een vacature op.

Voorbeeld:

```http
GET /vacancies/1/feedback
```

Voorbeeld response:

```json
{
  "data": {
    "id": 1,
    "vacancy_id": 1,
    "motivation_letter": "...",
    "ai_feedback": {
      "reaction": "...",
      "good_points": [],
      "improvement_points": [],
      "profile_suggestions": [],
      "improved_example": "..."
    },
    "accepted": true
  }
}
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
| --------- | ------- | -------- | ------------------------ |
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
| -------------- | ------- | --------------------------------------- |
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
| ------- | ------ | -------- | ------------------------------------- |
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

Haal alle video's op

```http
GET /videos
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": [
        {
            "id": 1,
            "title": "Intro to React Hooks",
            "description": "Leer de basis van React Hooks zoals useState en useEffect.",
            "video_url": "https://example.com/videos/react-hooks",
            "duration_seconds": 540,
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z",
            "category": {
                "id": 1,
                "name": "Frontend",
                "description": "Frontend development"
            }
        }
    ]
}
```

---
Response velden:

| Field            | Type    | Uitleg                        |
|------------------|---------|-------------------------------|
| id               | integer | Video ID                      |
| title            | string  | Titel van de video            |
| description      | string  | Omschrijving van de video     |
| video_url        | string  | Link naar de video            |
| duration_seconds | integer | Duur van de video in seconden |
| category         | object  | Gekoppelde category           |

---
Frontend Flow

```
1. Gebruiker navigeert naar video overzicht
2. Frontend roept GET /videos aan
3. Backend retourneert lijst van videos met category
4. Frontend toont videos in cards/lijst
5. Gebruiker kan video selecteren
```

---

### Get video

Haal 1 specifieke video op

```http
GET /videos/{id}
Authorization: Bearer jwt_token_here
```

---
Url parameters:

| Parameter | Type    | Required | Uitleg          |
|-----------|---------|----------|-----------------|
| id        | integer | Ja       | ID van de video |

---
Voorbeeld response:

```json
{
    "data": {
        "id": 1,
        "title": "Intro to React Hooks",
        "description": "Leer de basis van React Hooks zoals useState en useEffect.",
        "video_url": "https://example.com/videos/react-hooks",
        "duration_seconds": 540,
        "created_at": "2026-06-09T10:30:00.000000Z",
        "updated_at": "2026-06-09T10:30:00.000000Z",
        "category": {
            "id": 1,
            "name": "Frontend",
            "description": "Frontend development"
        }
    }
}
```

---
velden:

| Field            | Type    | Uitleg                |
|------------------|---------|-----------------------|
| id               | integer | Video ID              |
| title            | string  | Titel van de video    |
| description      | string  | Omschrijving          |
| video_url        | string  | Video link            |
| duration_seconds | integer | Duur in seconden      |
| category         | object  | Bijbehorende category |

---
Frontend Flow

```
1. Gebruiker klikt op video
2. Frontend roept GET /videos/{id} aan
3. Backend retourneert video details
4. Frontend toont video player + info
5. Gebruiker bekijkt video
```

## Categories Endpoints

### Get categories

Haal alle categorieën op

```http
GET /videos/{id}
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
    "data": [
        {
            "id": 1,
            "name": "Frontend",
            "description": "Frontend development",
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z"
        },
        {
            "id": 2,
            "name": "Backend",
            "description": "Backend development",
            "created_at": "2026-06-09T10:30:00.000000Z",
            "updated_at": "2026-06-09T10:30:00.000000Z"
        }
    ]
}
```

---
Response velden:

| Field       | Type    | Uitleg            |
|-------------|---------|-------------------|
| id          | integer | Category ID       |
| name        | string  | Naam van category |
| description | string  | Omschrijving      |

---
frontend flow

```
1. Frontend laadt categories bij filter/page load
2. GET /categories wordt aangeroepen
3. Backend retourneert lijst van categories
4. Frontend gebruikt categories voor filtering
5. Gebruiker filtert videos/vacancies
```

### Get category

Haalt de details van één specifieke categorie op.

```http
GET /videos/{id}
Authorization: Bearer jwt_token_here
```

---
Url parameters:

| Parameter | Type    | Required | Uitleg      |
|-----------|---------|----------|-------------|
| id        | integer | Ja       | Category ID |

---
Voorbeeld response:

```json
{
    "data": {
        "id": 1,
        "name": "Frontend",
        "description": "Frontend development",
        "created_at": "2026-06-09T10:30:00.000000Z",
        "updated_at": "2026-06-09T10:30:00.000000Z",
        "videos": [
            {
                "id": 1,
                "title": "Intro to React Hooks",
                "description": "Leer de basis van React Hooks.",
                "video_url": "https://example.com/videos/react-hooks",
                "duration_seconds": 540
            }
        ]
    }
}
```

---
Response velden:

| Field       | Type    | Uitleg                      |
|-------------|---------|-----------------------------|
| id          | integer | Category ID                 |
| name        | string  | Category naam               |
| description | string  | Category omschrijving       |
| videos      | array   | Alle videos binnen category |

---

Frontend flow

```
1. Gebruiker klikt op category
2. Frontend roept GET /categories/{id} aan
3. Backend retourneert category + videos
4. Frontend toont category detail pagina
5. Gebruiker bekijkt videos binnen category
```

---

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
