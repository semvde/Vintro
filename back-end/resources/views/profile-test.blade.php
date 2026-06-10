<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>VINTRO Profile Test</title>
</head>
<body>

<h1>Profile Test</h1>

<button onclick="loadProfile()">Laad profiel</button>
<button onclick="generateVacancies()">Genereer vacatures</button>
<button onclick="goToVacancies()">Bekijk vacatures</button>
<button onclick="logout()">Logout</button>

<pre id="output"></pre>

<script>
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login-test';
}

async function loadProfile() {
    const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();

    document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);
}

async function generateVacancies() {
    const response = await fetch('/api/vacancies/generate', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();

    document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);
}

function goToVacancies() {
    window.location.href = '/vacancies-test';
}

async function logout() {
    await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login-test';
}
</script>

</body>
</html>