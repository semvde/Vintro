## README die niet vernaggeld wordt door anderen 
* [Vacancy Endpoints](#vacancy-endpoints)

  * [Get Vacancies](#get-vacancies)
  * [Get Vacancy](#get-vacancy)
  * [Generate Vacancies](#generate-vacancies)

* [Vacancy Feedback Endpoints](#vacancy-feedback-endpoints)

  * [Generate Vacancy Feedback](#generate-vacancy-feedback)
  * [Get Vacancy Feedback History](#get-vacancy-feedback-history)
  * [Get Accepted Vacancy Feedback](#get-accepted-vacancy-feedback)
  * [Get Vacancy Feedback Detail](#get-vacancy-feedback-detail)
  * [Get Latest Feedback For Vacancy](#get-latest-feedback-for-vacancy)

* [Interview Feedback Endpoints](#interview-feedback-endpoints)

  * [Get Interview Feedbacks](#get-interview-feedbacks)
  * [Get Interview Feedback](#get-interview-feedback)


## Endpoints tabel

| Method | Endpoint | Beschrijving | Auth nodig |
|---|---|---|---|
| GET | `/vacancies` | Alle vacatures van gebruiker ophalen | Ja |
| GET | `/vacancies/{id}` | Specifieke vacature ophalen | Ja |
| POST | `/vacancies/generate` | Genereert 15 oefenvacatures op basis van profiel | Ja |
| POST | `/vacancy-feedback` | Motivatiebrief opslaan en AI-feedback genereren | Ja |
| GET | `/vacancy-feedback` | Geschiedenis van motivatiebrief feedback ophalen | Ja |
| GET | `/vacancy-feedback/accepted` | Alle goedgekeurde motivatiebrief feedback ophalen | Ja |
| GET | `/vacancy-feedback/{id}` | Specifiek feedbackrecord ophalen | Ja |
| GET | `/vacancies/{vacancy}/feedback` | Laatste feedback voor specifieke vacature ophalen | Ja |

## Vacancy Endpoints

### Get Vacancies

Haalt alle vacatures op die gekoppeld zijn aan de ingelogde gebruiker.

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
      "title": "Winkelmedewerker",
      "description": "Je helpt klanten, vult schappen en zorgt dat de winkel netjes blijft.",
      "salary": 14,
      "company": "Albert Heijn",
      "location": "Utrecht",
      "employment_type": "part-time",
      "user_id": 1
    }
  ]
}
```

---

### Get Vacancy

Haalt één specifieke vacature op van de ingelogde gebruiker.

```http
GET /vacancies/{id}
Authorization: Bearer jwt_token_here
```

---

### Generate Vacancies

Genereert 15 oefenvacatures op basis van het `user_profile`.

```http
POST /vacancies/generate
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
  "message": "15 oefenvacatures aangemaakt.",
  "count": 15,
  "data": []
}
```

---

## Vacancy Feedback Endpoints

### Generate Vacancy Feedback

Slaat een motivatiebrief op en genereert direct AI-feedback.

```http
POST /vacancy-feedback
Authorization: Bearer jwt_token_here
```

Voorbeeld request:

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
        "Uit je profiel/CV blijkt dat je ervaring hebt als vakkenvuller. Dit kun je toevoegen aan je brief."
      ],
      "improved_example": "Beste Albert Heijn..."
    },
    "accepted": false
  }
}
```

`accepted` betekent hier: de motivatiebrief is volgens Victoria klaar om te versturen.

---

### Get Vacancy Feedback History

Haalt alle motivatiebrief-feedback van de ingelogde gebruiker op voor de geschiedenispagina.

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
      "motivation_letter": "Beste Albert Heijn...",
      "ai_feedback": {
        "reaction": "...",
        "good_points": [],
        "improvement_points": [],
        "profile_suggestions": [],
        "improved_example": "..."
      },
      "accepted": false,
      "created_at": "2026-06-15T08:33:56.000000Z",
      "vacancy": {
        "id": 1,
        "title": "Winkelmedewerker",
        "company": "Albert Heijn",
        "location": "Utrecht",
        "employment_type": "part-time",
        "salary": 14,
        "description": "Je helpt klanten, vult schappen en zorgt dat de winkel netjes blijft."
      }
    }
  ]
}
```

---

### Get Accepted Vacancy Feedback

Haalt alle motivatiebrief-feedback op waarbij `accepted` gelijk is aan `true`.

Dit betekent dat Victoria de motivatiebrief goed genoeg vindt om te versturen.

```http
GET /vacancy-feedback/accepted
Authorization: Bearer jwt_token_here
```

Voorbeeld response:

```json
{
  "data": [
    {
      "id": 1,
      "vacancy_id": 1,
      "motivation_letter": "Beste Albert Heijn...",
      "ai_feedback": {
        "reaction": "...",
        "good_points": [],
        "improvement_points": [],
        "profile_suggestions": [],
        "improved_example": "..."
      },
      "accepted": true,
      "created_at": "2026-06-15T08:33:56.000000Z",
      "vacancy": {
        "id": 1,
        "title": "Winkelmedewerker",
        "company": "Albert Heijn",
        "location": "Utrecht",
        "employment_type": "part-time",
        "salary": 14,
        "description": "Je helpt klanten, vult schappen en zorgt dat de winkel netjes blijft."
      }
    }
  ]
}
```

---

### Get Vacancy Feedback Detail

Haalt één specifiek feedbackrecord op. Dit endpoint gebruikt het feedback-id.

```http
GET /vacancy-feedback/{id}
Authorization: Bearer jwt_token_here
```

Voorbeeld:

```http
GET /vacancy-feedback/1
```

---

### Get Latest Feedback For Vacancy

Haalt de laatst opgeslagen feedback op voor één specifieke vacature.

```http
GET /vacancies/{vacancy}/feedback
Authorization: Bearer jwt_token_here
```

Voorbeeld:

```http
GET /vacancies/1/feedback
```