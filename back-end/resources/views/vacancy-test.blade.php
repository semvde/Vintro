<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Vacature Detail Test</title>
</head>
<body>

<h1>Vacature Detail Test</h1>

<button onclick="window.location.href='/vacancies-test'">Terug naar vacatures</button>

<div id="vacancy"></div>

<h2>Motivatiebrief</h2>

<textarea id="motivation_letter" rows="10" cols="80">
Beste werkgever, ik wil graag bij jullie werken omdat deze functie goed past bij mijn interesses en ervaring. Ik ben gemotiveerd, leer snel en werk graag samen.
</textarea>

<br><br>

<button onclick="sendMotivationLetter()">Verstuur motivatiebrief</button>

<h2>AI Feedback</h2>
<pre id="feedback"></pre>

<script>
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login-test';
}

const vacancyId = window.location.pathname.split('/').pop();

async function loadVacancy() {
    const response = await fetch(`/api/vacancies/${vacancyId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    const vacancy = data.data;

    document.getElementById('vacancy').innerHTML = `
        <h2>${vacancy.title}</h2>
        <p><strong>Bedrijf:</strong> ${vacancy.company}</p>
        <p><strong>Locatie:</strong> ${vacancy.location}</p>
        <p><strong>Type:</strong> ${vacancy.employment_type}</p>
        <p><strong>Salaris:</strong> ${vacancy.salary}</p>
        <p>${vacancy.description}</p>
    `;
}

async function sendMotivationLetter() {
    const motivationLetter = document.getElementById('motivation_letter').value;

    const response = await fetch('/api/vacancy-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            vacancy_id: Number(vacancyId),
            motivation_letter: motivationLetter
        })
    });

    const data = await response.json();

    document.getElementById('feedback').textContent =
        JSON.stringify(data, null, 2);
}

loadVacancy();
</script>

</body>
</html>