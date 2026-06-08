<!DOCTYPE html>
<html>
<head>
    <title>Profile Generator Test</title>
</head>
<body>

<h1>Profile Generator Test</h1>

<button onclick="generateProfile()">
    Genereer profiel
</button>

<pre id="output"></pre>

<script>
async function generateProfile() {

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Geen token gevonden');
        return;
    }

    const response = await fetch('/api/profile/generate', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();

    document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);

    console.log(data);
}
</script>

</body>
</html>