# VINTRO Backend API Endpoints

## Inhoudsopgave

* [Base URL](#base-url)
* [Auth Endpoints](#auth-endpoints)

  * [Register](#register)
  * [Login](#login)
  * [Get Current User](#get-current-user)
  * [Logout](#logout)
* [Onboarding Endpoints](#onboarding-endpoints)

  * [Start Onboarding](#start-onboarding)
  * [Onboarding Chat](#onboarding-chat)
* [Text-to-Speech Endpoint](#text-to-speech-endpoint)

  * [Generate Speech](#generate-speech)
* [Huidige API Routes Overzicht](#huidige-api-routes-overzicht)
* [Frontend Notes](#frontend-notes)

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

## Huidige API routes overzicht

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
---

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

## Onboarding endpoints

De onboarding wordt gebruikt om informatie van de gebruiker te verzamelen. Deze informatie wordt later gebruikt voor profielopbouw, CV-generatie en vacature-oefeningen.

---

### Start onboarding

Haalt het standaard startbericht van VINTRO op.

```http
GET /onboarding/start
```

Gebruik dit wanneer de gebruiker de onboardingpagina opent.

Voorbeeld response:

```json
{
  "reply": "Hoi, ik ben VINTRO. Ik stel je een paar korte vragen zodat ik straks een profiel en eerste CV voor je kan opbouwen. We doen dit stap voor stap. Om te beginnen: wat vind je leuk om te doen?",
  "type": "onboarding_start",
  "finished": false
}
```

Frontend flow:

```txt
1. Gebruiker opent onboardingpagina
2. Frontend roept GET /onboarding/start aan
3. Frontend toont reply als eerste VINTRO-bericht
```

---

### Onboarding chat

Stuurt een antwoord van de gebruiker naar de onboarding-AI. De AI geeft daarna een vervolgvraag of sluit de onboarding af.

```http
POST /onboarding/chat
```

Voorbeeld request:

```json
{
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
}
```

Velden:

| Field       | Type    | Required | Uitleg                                |
| ----------- | ------- | -------: | ------------------------------------- |
| `message`   | string  |       Ja | Het nieuwste bericht van de gebruiker |
| `step`      | integer |       Ja | Huidige onboardingstap                |
| `max_steps` | integer |       Ja | Maximaal aantal onboardingstappen     |
| `history`   | array   |      Nee | Eerdere chatberichten voor context    |

Voorbeeld response tijdens onboarding:

```json
{
  "reply": "Dat klinkt alsof je interesse hebt in technologie en mensen helpen. Heb je al eens nagedacht over werk in ICT of klantenservice?",
  "type": "onboarding_message",
  "finished": false,
  "next_action": "continue_onboarding"
}
```

Voorbeeld response bij laatste stap:

```json
{
  "reply": "Dankjewel, ik heb genoeg informatie om een eerste profiel voor je op te bouwen. Daarna kunnen we hiermee ook een eerste CV maken.",
  "type": "onboarding_finished",
  "finished": true,
  "next_action": "generate_profile"
}
```

Frontend flow:

```txt
1. Gebruiker stuurt antwoord
2. Frontend verhoogt step
3. Frontend stuurt message, step, max_steps en history naar POST /onboarding/chat
4. Frontend toont reply
5. Als finished true is, onboarding sluiten en doorgaan naar profiel/CV-generatie
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
const response = await fetch('/api/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'audio/wav',
  },
  body: JSON.stringify({
    text: 'Hoi, ik ben VINTRO.',
    voice: 'af_heart'
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

---


## Notes voor frontend

* Alle endpoints beginnen met `/api`.
* Voor lokale development is de volledige URL bijvoorbeeld:

```txt
http://127.0.0.1:8000/api/onboarding/start
```

* Protected routes hebben deze header nodig:

```txt
Authorization: Bearer jwt_token_here
```

* Onboarding werkt met een vaste flow vanuit frontend:

  * `GET /onboarding/start`
  * daarna meerdere keren `POST /onboarding/chat`
  * als `finished: true`, doorgaan naar profiel/CV-scherm.

* TTS geeft geen JSON terug maar audio. Gebruik daarom `response.blob()` in de frontend.
