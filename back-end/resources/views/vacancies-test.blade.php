<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Vacatures Test</title>
</head>
<body>

<h1>Vacatures Test</h1>

<button onclick="loadVacancies()">Laad vacatures</button>
<button onclick="window.location.href='/profile-test'">Terug naar profiel</button>

<div id="vacancies"></div>

<script>
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login-test';
}

async function loadVacancies() {
    const response = await fetch('/api/vacancies', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();

    const container = document.getElementById('vacancies');
    container.innerHTML = '';

    data.data.forEach(vacancy => {
        container.innerHTML += `
            <div style="border:1px solid #ddd; padding:15px; margin:15px 0;">
                <h2>${vacancy.title}</h2>
                <p><strong>Bedrijf:</strong> ${vacancy.company}</p>
                <p><strong>Locatie:</strong> ${vacancy.location}</p>
                <p>${vacancy.description}</p>
                <button onclick="viewVacancy(${vacancy.id})">Bekijk vacature</button>
            </div>
        `;
    });
}

function viewVacancy(id) {
    window.location.href = `/vacancy-test/${id}`;
}

loadVacancies();
</script>

</body>
</html>