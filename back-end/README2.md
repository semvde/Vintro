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

# Interview API

## Inhoudsopgave

* [API Routes Overzicht](#api-routes-overzicht)

* [Interview Endpoints](#interview-endpoints)

  * [Start Interview](#start-interview)
  * [Interview Chat](#interview-chat)

* [Interview Feedback Endpoints](#interview-feedback-endpoints)

  * [Get Interview Feedback History](#get-interview-feedback-history)
  * [Get Interview Feedback Detail](#get-interview-feedback-detail)

---

## API Routes Overzicht

| Method | Endpoint | Beschrijving | Auth nodig |
|---|---|---|---|
| POST | `/vacancies/{vacancyId}/interview/start` | Start interview voor specifieke vacature | Ja |
| POST | `/vacancies/{vacancyId}/interview/chat` | Stuurt antwoord naar AI-interviewer | Ja |
| GET | `/interview-feedback` | Geschiedenis van interviewfeedback ophalen | Ja |
| GET | `/interview-feedback/{id}` | Specifiek interviewfeedbackrecord ophalen | Ja |

---

# Interview Endpoints

## Start Interview

```http
POST /vacancies/{vacancyId}/interview/start
Authorization: Bearer jwt_token_here
```

Start een oefeninterview voor een specifieke vacature.

### URL Parameters

| Parameter | Type | Uitleg |
|---|---|---|
| vacancyId | integer | ID van de vacature |

### Voorbeeld

```http
POST /vacancies/1/interview/start
```

### Voorbeeld response

```json
{
  "reply": "Goedemiddag, fijn dat je er bent. Kun je kort iets over jezelf vertellen?",
  "type": "interview_start",
  "data": {
    "interview": {
      "id": 1,
      "vacancy_id": 1
    },
    "vacancy": {
      "id": 1,
      "title": "Winkelmedewerker",
      "company": "Albert Heijn",
      "location": "Utrecht"
    },
    "interviewer": "Emma"
  }
}
```

### Frontend flow

```text
1. Gebruiker opent een vacature
2. Gebruiker klikt op "Interview oefenen"
3. Frontend roept POST /vacancies/{vacancyId}/interview/start aan
4. Backend maakt of opent een interview
5. Backend stuurt de eerste interviewvraag terug
6. Frontend toont de vraag in de interviewchat
```

---

## Interview Chat

```http
POST /vacancies/{vacancyId}/interview/chat
Authorization: Bearer jwt_token_here
```

Stuurt een antwoord van de gebruiker naar de AI-interviewer.

### URL Parameters

| Parameter | Type | Uitleg |
|---|---|---|
| vacancyId | integer | ID van de vacature |

### Request body

```json
{
  "message": "Ik heb ervaring als vakkenvuller en vind het leuk om klanten te helpen.",
  "step": 1
}
```

### Voorbeeld response tijdens interview

```json
{
  "reply": "Goed antwoord. Kun je een concreet voorbeeld geven van een situatie waarin je een klant hebt geholpen?",
  "finished": false,
  "next_action": "continue_interview"
}
```

### Voorbeeld response bij afronding

```json
{
  "reply": "Bedankt voor het gesprek. Ik heb nu genoeg informatie om feedback te geven.",
  "finished": true,
  "next_action": "generate_interview_feedback",
  "data": {
    "feedback": {
      "id": 1,
      "interview_id": 1,
      "ai_feedback": {
        "reaction": "Je hebt rustig en duidelijk antwoord gegeven.",
        "good_points": [
          "Je antwoorden waren begrijpelijk."
        ],
        "improvement_points": [
          "Geef meer concrete voorbeelden uit je ervaring."
        ],
        "communication_feedback": [
          "Je toon is vriendelijk, maar je antwoorden mogen zelfverzekerder."
        ],
        "personal_presentation": [
          "Je komt gemotiveerd over, maar je mag sterker benoemen waarom jij past bij de functie."
        ],
        "next_interview_tips": [
          "Bereid vooraf twee praktijkvoorbeelden voor."
        ]
      },
      "accepted": false,
      "created_at": "2026-06-15T10:00:00.000000Z"
    }
  }
}
```

### Frontend flow

```text
1. Gebruiker typt antwoord in interviewchat
2. Frontend roept POST /vacancies/{vacancyId}/interview/chat aan
3. Backend stuurt antwoord naar AI-interviewer
4. Frontend toont reply
5. Herhaal tot finished true is
6. Als finished true is, toont frontend de feedback
7. Feedback wordt opgeslagen in interview_feedback
```

---

# Interview Feedback Endpoints

## Get Interview Feedback History

```http
GET /interview-feedback
Authorization: Bearer jwt_token_here
```

Haalt alle opgeslagen interviewfeedback op van de ingelogde gebruiker.

### Voorbeeld response

```json
{
  "data": [
    {
      "id": 1,
      "interview_id": 1,
      "ai_feedback": {
        "reaction": "Je hebt rustig en duidelijk antwoord gegeven.",
        "good_points": [
          "Je antwoorden waren begrijpelijk."
        ],
        "improvement_points": [
          "Geef meer concrete voorbeelden uit je ervaring."
        ],
        "communication_feedback": [
          "Je toon is vriendelijk, maar je antwoorden mogen zelfverzekerder."
        ],
        "personal_presentation": [
          "Je komt gemotiveerd over."
        ],
        "next_interview_tips": [
          "Bereid vooraf twee praktijkvoorbeelden voor."
        ]
      },
      "accepted": false,
      "created_at": "2026-06-15T10:00:00.000000Z",
      "interview": {
        "id": 1,
        "vacancy_id": 1,
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
    }
  ]
}
```

### Frontend flow

```text
1. Gebruiker opent Geschiedenis
2. Gebruiker klikt op tab Interviews
3. Frontend roept GET /interview-feedback aan
4. Backend retourneert alle interviewfeedback van gebruiker
5. Frontend toont interviewkaarten
6. Gebruiker kan doorklikken naar details
```

---

## Get Interview Feedback Detail

```http
GET /interview-feedback/{id}
Authorization: Bearer jwt_token_here
```

Haalt één specifiek interviewfeedbackrecord op.

### URL Parameters

| Parameter | Type | Uitleg |
|---|---|---|
| id | integer | ID van het interviewfeedbackrecord |

### Voorbeeld

```http
GET /interview-feedback/1
```

### Voorbeeld response

```json
{
  "data": {
    "id": 1,
    "interview_id": 1,
    "ai_feedback": {
      "reaction": "Je hebt rustig en duidelijk antwoord gegeven.",
      "good_points": [
        "Je antwoorden waren begrijpelijk."
      ],
      "improvement_points": [
        "Geef meer concrete voorbeelden uit je ervaring."
      ],
      "communication_feedback": [
        "Je toon is vriendelijk, maar je antwoorden mogen zelfverzekerder."
      ],
      "personal_presentation": [
        "Je komt gemotiveerd over."
      ],
      "next_interview_tips": [
        "Bereid vooraf twee praktijkvoorbeelden voor."
      ]
    },
    "accepted": false,
    "created_at": "2026-06-15T10:00:00.000000Z",
    "interview": {
      "id": 1,
      "vacancy_id": 1,
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
  }
}
```

### Frontend flow

```text
1. Gebruiker klikt op interviewkaart in geschiedenis
2. Frontend roept GET /interview-feedback/{id} aan
3. Backend retourneert volledige interviewfeedback
4. Frontend toont vacature-info, interviewfeedback en tips
```

---

# Database

## interview_feedback

```txt
id
interview_id
ai_feedback
accepted
created_at
updated_at
```

## ai_feedback structuur

`ai_feedback` wordt opgeslagen als JSON-string in de database en als object teruggegeven aan de frontend.

```json
{
  "reaction": "korte algemene reactie op het interview",
  "good_points": [],
  "improvement_points": [],
  "communication_feedback": [],
  "personal_presentation": [],
  "next_interview_tips": []
}
```

## Relaties

```text
User
└── Vacancy
    └── Interview
        └── InterviewFeedback
```

Alle interviewfeedback is user-gebonden via:

```text
interview_feedback → interviews → vacancies → users
```