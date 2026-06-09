<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>VINTRO Login Test</title>
</head>
<body>
    <h1>Login Test</h1>

    <input id="email" type="email" placeholder="Email" value="tester2@test.nl">
    <input id="password" type="password" placeholder="Password" value="password">
    <button onclick="login()">Login</button>

    <p id="status"></p>

    <script>
        async function login() {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                })
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                document.getElementById('status').innerText = 'Ingelogd, doorsturen naar chat...';

                window.location.href = '/chat-test';
            } else {
                document.getElementById('status').innerText = data.message ?? 'Login mislukt';
            }
        }
    </script>
</body>
</html>