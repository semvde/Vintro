# Vacancy API

## Inhoudsopgave

* [API Routes Overzicht](#api-routes-overzicht)

* [Vacancy Endpoints](#vacancy-endpoints)

  * [Get Vacancies](#get-vacancies)
  * [Get Vacancy](#get-vacancy)
  * [Generate Vacancies](#generate-vacancies)

* [Vacancy Feedback Endpoints](#vacancy-feedback-endpoints)

  * [Generate Vacancy Feedback](#generate-vacancy-feedback)
  * [Get Vacancy Feedback History](#get-vacancy-feedback-history)
  * [Get Vacancy Feedback Detail](#get-vacancy-feedback-detail)
  * [Get Latest Feedback For Vacancy](#get-latest-feedback-for-vacancy)

---

# API Routes Overzicht

| Method | Endpoint | Beschrijving | Auth nodig |
|----------|----------|----------|----------|
| GET | `/vacancies` | Alle vacatures van de gebruiker ophalen | Ja |
| GET | `/vacancies/{id}` | Specifieke vacature ophalen | Ja |
| POST | `/vacancies/generate` | 15 oefenvacatures genereren op basis van profiel | Ja |
| POST | `/vacancy-feedback` | Motivatiebrief opslaan en AI-feedback genereren | Ja |
| GET | `/vacancy-feedback` | Alle motivatiebrief feedback van gebruiker ophalen | Ja |
| GET | `/vacancy-feedback/{id}` | Specifiek feedback item ophalen | Ja |
| GET | `/vacancies/{vacancy}/feedback` | Laatste feedback voor een vacature ophalen | Ja |

---

# Vacancy Endpoints

## Get Vacancies

```http
GET /vacancies
Authorization: Bearer jwt_token_here
```

Haalt alle vacatures op die gekoppeld zijn aan de ingelogde gebruiker.

### Voorbeeld response

```json
{
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "company": "Tech Company",
      "location": "Rotterdam",
      "employment_type": "full-time",
      "salary": 3200,
      "description": "Wij zoeken een frontend developer..."
    }
  ]
}
```

### Frontend flow

```text
1. Gebruiker opent vacatureoverzicht
2. Frontend roept GET /vacancies aan
3. Backend retourneert vacatures van gebruiker
4. Frontend toont vacaturekaarten
```

---

## Get Vacancy

```http
GET /vacancies/{id}
Authorization: Bearer jwt_token_here
```

Haalt één specifieke vacature op.

### URL Parameters

| Parameter | Type | Uitleg |
|------------|------------|------------|
| id | integer | ID van de vacature |

### Voorbeeld

```http
GET /vacancies/1
```

### Voorbeeld response

```json
{
  "data": {
    "id": 1,
    "title": "Frontend Developer",
    "company": "Tech Company",
    "location": "Rotterdam",
    "employment_type": "full-time",
    "salary": 3200,
    "description": "Wij zoeken een frontend developer..."
  }
}
```

---

## Generate Vacancies

```http
POST /vacancies/generate
Authorization: Bearer jwt_token_here
```

Genereert 15 oefenvacatures op basis van het user profile.

De AI gebruikt onder andere:

- skills
- werkervaring
- interesses
- sterke punten
- job preferences
- profielsamenvatting

### Voorbeeld response

```json
{
  "message": "15 oefenvacatures aangemaakt.",
  "count": 15,
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "company": "Tech Company"
    }
  ]
}
```

### Opmerkingen

- Genereert altijd precies 15 vacatures.
- Vacatures zijn fictief.
- Vacatures zijn alleen zichtbaar voor de ingelogde gebruiker.
- Nieuwe vacatures worden gekoppeld aan de gebruiker.

### Frontend flow

```text
1. Gebruiker klikt op vacatures genereren
2. Frontend roept POST /vacancies/generate aan
3. Backend genereert 15 vacatures
4. Frontend toont vacaturelijst
```

---

# Vacancy Feedback Endpoints

## Generate Vacancy Feedback

```http
POST /vacancy-feedback
Authorization: Bearer jwt_token_here
```

Slaat een motivatiebrief op en laat Victoria feedback genereren.

### Request body

```json
{
  "vacancy_id": 1,
  "motivation_letter": "Beste werkgever, ik solliciteer op deze functie omdat..."
}
```

### Voorbeeld response

```json
{
  "message": "Motivatiebrief opgeslagen en feedback gegenereerd.",
  "data": {
    "id": 1,
    "vacancy_id": 1,
    "motivation_letter": "Beste werkgever...",
    "ai_feedback": {
      "reaction": "Je hebt een goede basis gelegd.",
      "good_points": [
        "Je motivatie is duidelijk."
      ],
      "improvement_points": [
        "Maak de brief persoonlijker."
      ],
      "profile_suggestions": [
        "Uit je profiel blijkt dat je ervaring hebt met klantenservice. Dit kun je toevoegen."
      ],
      "improved_example": "Beste werkgever..."
    },
    "accepted": false
  }
}
```

### Response velden

| Field | Type | Uitleg |
|----------|----------|----------|
| accepted | boolean | Of de brief goed genoeg is om te versturen |
| reaction | string | Algemene reactie van Victoria |
| good_points | array | Positieve punten in de motivatiebrief |
| improvement_points | array | Verbeterpunten voor de motivatiebrief |
| profile_suggestions | array | Suggesties gebaseerd op profiel/CV |
| improved_example | string | Verbeterde voorbeeldversie |

### Frontend flow

```text
1. Gebruiker schrijft motivatiebrief
2. Frontend verstuurt POST /vacancy-feedback
3. Victoria beoordeelt de brief
4. Feedback wordt opgeslagen
5. Frontend toont feedbackpagina
```

---

## Get Vacancy Feedback History

```http
GET /vacancy-feedback
Authorization: Bearer jwt_token_here
```

Haalt alle opgeslagen motivatiebrief-feedback op van de gebruiker.

### Voorbeeld response

```json
{
  "data": [
    {
      "id": 1,
      "vacancy_id": 1,
      "accepted": false,
      "created_at": "2026-06-15T10:00:00.000000Z",
      "vacancy": {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Tech Company",
        "location": "Rotterdam"
      }
    }
  ]
}
```

### Frontend flow

```text
1. Gebruiker opent Geschiedenis
2. Frontend roept GET /vacancy-feedback aan
3. Backend retourneert alle feedback records
4. Frontend toont overzichtskaarten
5. Gebruiker kan doorklikken naar details
```

---

## Get Vacancy Feedback Detail

```http
GET /vacancy-feedback/{id}
Authorization: Bearer jwt_token_here
```

Haalt één specifiek feedbackrecord op.

### URL Parameters

| Parameter | Type | Uitleg |
|------------|------------|------------|
| id | integer | ID van feedbackrecord |

### Voorbeeld

```http
GET /vacancy-feedback/5
```

### Voorbeeld response

```json
{
  "data": {
    "id": 5,
    "vacancy_id": 1,
    "motivation_letter": "Beste werkgever...",
    "accepted": false,
    "created_at": "2026-06-15T10:00:00.000000Z",
    "ai_feedback": {
      "reaction": "Je hebt een goede basis gelegd.",
      "good_points": [],
      "improvement_points": [],
      "profile_suggestions": [],
      "improved_example": "..."
    },
    "vacancy": {
      "id": 1,
      "title": "Frontend Developer",
      "company": "Tech Company",
      "location": "Rotterdam"
    }
  }
}
```

### Frontend flow

```text
1. Gebruiker klikt op feedbackkaart
2. Frontend roept GET /vacancy-feedback/{id} aan
3. Backend retourneert volledige feedback
4. Frontend toont motivatiebrief en feedback
```

---

## Get Latest Feedback For Vacancy

```http
GET /vacancies/{vacancy}/feedback
Authorization: Bearer jwt_token_here
```

Haalt de meest recente feedback op voor een specifieke vacature.

Dit endpoint wordt gebruikt direct na het versturen van een motivatiebrief of bij het opnieuw openen van een vacature.

### URL Parameters

| Parameter | Type | Uitleg |
|------------|------------|------------|
| vacancy | integer | ID van de vacature |

### Voorbeeld

```http
GET /vacancies/1/feedback
```

### Voorbeeld response

```json
{
  "data": {
    "id": 1,
    "vacancy_id": 1,
    "motivation_letter": "...",
    "accepted": true,
    "ai_feedback": {
      "reaction": "...",
      "good_points": [],
      "improvement_points": [],
      "profile_suggestions": [],
      "improved_example": "..."
    }
  }
}
```

### Frontend flow

```text
1. Gebruiker opent vacature
2. Frontend controleert of eerdere feedback bestaat
3. Frontend roept GET /vacancies/{vacancy}/feedback aan
4. Backend retourneert laatste feedback
5. Frontend toont bestaande feedback indien aanwezig
```