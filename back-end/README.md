# VINTRO Backend API Endpoints

## Inhoudsopgave

<<<<<<< HEAD
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

  * [Generate Profile](#generate-profile)

* [Text-to-Speech Endpoint](#text-to-speech-endpoint)

  * [Generate Speech](#generate-speech)

* [Frontend Notes](#frontend-notes)
=======
- [Base URL](#base-url)
- [Auth Endpoints](#auth-endpoints)
    - [Register](#register)
    - [Login](#login)
    - [Get Current User](#get-current-user)
    - [Logout](#logout)

- [Onboarding Endpoints](#onboarding-endpoints)
    - [Start Onboarding](#start-onboarding)
    - [Onboarding Chat](#onboarding-chat)

- [Text-to-Speech Endpoint](#text-to-speech-endpoint)
    - [Generate Speech](#generate-speech)

- [Huidige API Routes Overzicht](#huidige-api-routes-overzicht)
- [Frontend Notes](#frontend-notes)
>>>>>>> dev

---

## Base URL

Online (live):

```
http://145.24.223.123:8000/
```

Base URL lokaal:

```txt
http://127.0.0.1:8000/api
```

Gebruik bij JSON requests altijd deze headers:

```txt
Accept: application/json
Content-Type: application/json
```

---

- Alle endpoints beginnen met `/api`.
- Voor lokale development is de volledige URL bijvoorbeeld:

```txt
http://127.0.0.1:8000/api/onboarding/start
```

## Huidige API routes overzicht

<<<<<<< HEAD
| Method | Endpoint            | Beschrijving                                             | Auth nodig |
| ------ | ------------------- | -------------------------------------------------------- | ---------- |
| POST   | `/register`         | Nieuwe gebruiker registreren                             | Nee        |
| POST   | `/login`            | Gebruiker inloggen                                       | Nee        |
| GET    | `/user`             | Ingelogde gebruiker ophalen                              | Ja         |
| POST   | `/logout`           | Gebruiker uitloggen                                      | Ja         |
| GET    | `/onboarding/start` | Startbericht onboarding ophalen                          | Ja         |
| POST   | `/onboarding/chat`  | Onboarding-chat met Victoria                             | Ja         |
| POST   | `/profile/generate` | Genereert user_profile op basis van afgeronde onboarding | Ja         |
| POST   | `/tts`              | Tekst omzetten naar audio                                | Nee        |
| POST   | `/coach`            | Algemene coach-chat met Victoria                         | Nee        |
=======
| Method | Endpoint            | Beschrijving                    | Auth nodig |
| ------ | ------------------- | ------------------------------- | ---------- |           
| POST   | `/register`         | Nieuwe gebruiker registreren    | Nee        |           
| POST   | `/login`            | Gebruiker inloggen              | Nee        |           
| GET    | `/onboarding/start` | Startbericht onboarding ophalen | Nee        |           
| POST   | `/onboarding/chat`  | Onboarding-chat met AI          | Nee        |           
| POST   | `/tts`              | Tekst omzetten naar audio       | Nee        |           
| GET    | `/user`             | Ingelogde gebruiker ophalen     | Ja         |           
| POST   | `/logout`           | Gebruiker uitloggen             | Ja         |           
| POST   | `/coach`            | Praten met Victoria :)          | Nee        |           
>>>>>>> dev

---

## Coach endpoints

parameters:

```
'message' => 'required|string|max:5000',
'page' => 'nullable|string|max:100',
'history' => 'nullable|array',
```


```
'/cv' => 'De gebruiker is bezig met het opstellen van een CV.',
'/vacatures' => 'De gebruiker bekijkt vacatures.',
'/onboarding' => 'De gebruiker doorloopt de onboarding.',
```

## Auth endpoints

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

## Protected auth endpoints

Voor deze endpoints is een JWT-token nodig.

Header:

```txt
Authorization: Bearer jwt_token_here
```

### Get current user

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

# Onboarding endpoints

De onboarding verzamelt informatie voor een werkprofiel, eerste CV en sollicitatie-oefeningen.

## Start onboarding

```http
GET /onboarding/start
```

Gebruik dit wanneer de gebruiker de onboardingpagina opent.

Voorbeeld response:

```json
{
<<<<<<< HEAD
  "reply": "Hoi Test User, ik ben Victoria. Ik help je stap voor stap om je voor te bereiden op solliciteren. We bouwen eerst een werkprofiel op, zodat we daarna een eerste CV kunnen maken en je sollicitaties kunt oefenen. Om te beginnen: hoe oud ben je?",
  "type": "onboarding_start"
=======
    "reply": "Hoi, ik ben VINTRO. Ik stel je een paar korte vragen zodat ik straks een profiel en eerste CV voor je kan opbouwen. We doen dit stap voor stap. Om te beginnen: wat vind je leuk om te doen?",
    "type": "onboarding_start",
    "finished": false
>>>>>>> dev
}
```

Frontend flow:

```txt
1. Gebruiker opent onboardingpagina
2. Frontend roept GET /onboarding/start aan
3. Frontend toont reply als eerste assistant-bericht
```

---

## Onboarding chat

```http
POST /onboarding/chat
```

Stuurt een antwoord van de gebruiker naar Victoria. De backend slaat de chatgeschiedenis op in `onboarding_sessions.chat_history`.

Voorbeeld request:

```json
{
<<<<<<< HEAD
  "message": "Ik ben 23 jaar",
  "step": 1
=======
    "message": "Ik vind gamen leuk en ik help soms vrienden met computers.",
    "step": 1,
    "max_steps": 6,
    "history": [
        {
            "role": "assistant",
            "content": "Hoi, ik ben VINTRO. Ik stel je een paar korte vragen zodat ik straks een profiel en eerste CV voor je kan opbouwen. We doen dit stap voor stap. Om te beginnen: wat vind je leuk om te doen?"
        },
        {
            "role": "user",
            "content": "Ik vind gamen leuk en ik help soms vrienden met computers."
        }
    ]
>>>>>>> dev
}
```

Velden:

| Field     | Type    | Required | Uitleg                                            |
| --------- | ------- | -------: | ------------------------------------------------- |
| `message` | string  |       Ja | Het nieuwste bericht van de gebruiker             |
| `step`    | integer |       Ja | Huidige onboardingstap, bijgehouden door frontend |

Frontend hoeft geen `history` of `max_steps` mee te sturen. De backend bepaalt zelf wanneer de onboarding klaar is.

Voorbeeld response tijdens onboarding:

```json
{
<<<<<<< HEAD
  "reply": "Wat is je laatste opleiding of schoolervaring?",
  "finished": false,
  "next_action": "continue_onboarding"
=======
    "reply": "Dat klinkt alsof je interesse hebt in technologie en mensen helpen. Heb je al eens nagedacht over werk in ICT of klantenservice?",
    "type": "onboarding_message",
    "finished": false,
    "next_action": "continue_onboarding"
>>>>>>> dev
}
```

Voorbeeld response wanneer onboarding klaar is:

```json
{
<<<<<<< HEAD
  "reply": "Dankjewel voor je antwoorden. Ik heb genoeg informatie voor je werkprofiel en eerste CV.",
  "finished": true,
  "next_action": "generate_profile"
=======
    "reply": "Dankjewel, ik heb genoeg informatie om een eerste profiel voor je op te bouwen. Daarna kunnen we hiermee ook een eerste CV maken.",
    "type": "onboarding_finished",
    "finished": true,
    "next_action": "generate_profile"
>>>>>>> dev
}
```

Frontend flow:

```txt
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

# Profile Endpoints 
#### (profile generation na onboarding )

## Generate profile

```http
POST /profile/generate
```

Genereert een `user_profile` op basis van de afgeronde onboarding-chat.

Deze endpoint heeft geen body nodig. De backend gebruikt de ingelogde gebruiker en zoekt automatisch de afgeronde onboarding session.

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

```txt
1. Wacht tot /onboarding/chat finished true teruggeeft
2. Roep POST /profile/generate aan
3. Gebruik response.profile voor preview, CV-generatie of dashboard
4. Ga daarna door naar CV-pagina of dashboard
```

---

## Text-to-Speech endpoint

### Generate speech

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
| ------- | ------ | -------: | ------------------------------------- |
| `text`  | string |       Ja | De tekst die uitgesproken moet worden |
| `voice` | string |      Nee | Steminstelling voor het TTS-model     |

Response:

```txt
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

## Notes voor frontend

- Alle endpoints beginnen met `/api`.
- Voor lokale development is de volledige URL bijvoorbeeld:

```txt
http://127.0.0.1:8000/api/onboarding/start
```

- Protected routes hebben deze header nodig:

```txt
Authorization: Bearer jwt_token_here
```

- Onboarding werkt met een vaste flow vanuit frontend:
    - `GET /onboarding/start`
    - daarna meerdere keren `POST /onboarding/chat`
    - als `finished: true`, doorgaan naar profiel/CV-scherm.

- TTS geeft geen JSON terug maar audio. Gebruik daarom `response.blob()` in de frontend.
