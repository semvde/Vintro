<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>VINTRO Chat Test</title>
    <button onclick="logout()">Logout</button>
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

    <div id="chat"></div>

    <input id="message" type="text" placeholder="Typ je bericht..." />
    <button onclick="sendMessage()">Verstuur</button>

    <script>

        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login-test';
        }

        async function logout() {
            const token = localStorage.getItem('token');

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
        let step = 0;
        const maxSteps = 13;
        let history = [];

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

            history.push({
                role: 'assistant',
                content: data.reply
            });
        };

        async function sendMessage() {
            const input = document.getElementById('message');
            const chat = document.getElementById('chat');
            const message = input.value.trim();

            if (!message) return;

            chat.innerHTML += `<div class="user">Jij: ${message}</div>`;
            input.value = '';

            history.push({
                role: 'user',
                content: message
            });

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
                    max_steps: maxSteps,
                    history: history
                })
            });

            const data = await response.json();

            chat.innerHTML += `<div class="bot">VINTRO: ${data.reply ?? 'Geen antwoord ontvangen.'}</div>`;

            history.push({
                role: 'assistant',
                content: data.reply
            });

            if (data.finished) {
                input.disabled = true;
            }
        }
    </script>
</body>
</html>