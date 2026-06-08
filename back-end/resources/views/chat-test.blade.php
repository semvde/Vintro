<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>VINTRO Chat Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; }
        #chat { border: 1px solid #ddd; padding: 20px; min-height: 300px; margin-bottom: 15px; }
        .user { font-weight: bold; margin-top: 12px; }
        .bot { margin: 8px 0 12px 20px; }
        input { width: 80%; padding: 10px; }
        button { padding: 10px 16px; }
    </style>
</head>
<body>
    <h1>VINTRO Chat Test</h1>

    <button onclick="logout()">Logout</button>

    <div id="chat"></div>

    <input id="message" type="text" placeholder="Typ je bericht..." />
    <button onclick="sendMessage()">Verstuur</button>

    <button id="generateProfileBtn" onclick="generateProfile()" style="display:none;">
        Genereer profiel
    </button>

    <pre id="profileOutput"></pre>

    <script>
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login-test';
        }

        let step = 0;
        const maxSteps = 20;
        let finished = false;

        window.onload = async () => {
            const response = await fetch('/api/onboarding/start', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            const chat = document.getElementById('chat');
            chat.innerHTML += `<div class="bot">Victoria: ${data.reply}</div>`;
        };
        
        async function sendMessage() {
            if (finished) return;

            const input = document.getElementById('message');
            const chat = document.getElementById('chat');
            const message = input.value.trim();

            if (!message) return;

            chat.innerHTML += `<div class="user">Jij: ${message}</div>`;
            input.value = '';

            step++;

            const response = await fetch('/api/onboarding/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: message,
                    step: step,
                    max_steps: maxSteps
                })
            });

            const data = await response.json();

            chat.innerHTML += `<div class="bot">Victoria: ${data.reply ?? 'Geen antwoord ontvangen.'}</div>`;

            if (data.finished) {
                finished = true;
                input.disabled = true;
                document.getElementById('generateProfileBtn').style.display = 'block';
            }
        }

        async function logout() {
            try {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
            } catch (e) {
                console.error(e);
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href = '/login-test';
        }

        async function generateProfile() {
            const response = await fetch('/api/profile/generate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            document.getElementById('profileOutput').textContent =
                JSON.stringify(data, null, 2);
        }
    </script>
</body>
</html>