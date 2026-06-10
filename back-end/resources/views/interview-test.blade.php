<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>VINTRO Interview Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; }
        #chat { border: 1px solid #ddd; padding: 20px; min-height: 300px; margin-bottom: 15px; }
        .user { font-weight: bold; margin-top: 12px; }
        .bot { margin: 8px 0 12px 20px; }
        input { width: 80%; padding: 10px; margin-bottom: 10px; }
        button { padding: 10px 16px; }
        pre { white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>VINTRO Interview Test</h1>

    <button onclick="logout()">Logout</button>

    <div style="margin: 16px 0;">
        <input id="vacancyId" type="number" placeholder="Vul vacancy ID in" />
        <button onclick="startInterview()">Start interview</button>
    </div>

    <div id="chat"></div>

    <input id="message" type="text" placeholder="Typ je bericht..." disabled />
    <button onclick="sendMessage()" disabled>Verstuur</button>

    <pre id="feedbackOutput"></pre>

    <script>
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login-test';
        }

        const urlParams = new URLSearchParams(window.location.search);
        const vacancyInput = document.getElementById('vacancyId');

        if (urlParams.get('vacancyId')) {
            vacancyInput.value = urlParams.get('vacancyId');
        }

        let step = 0;
        let vacancyId = vacancyInput.value;
        let finished = false;

        async function startInterview() {
            vacancyId = vacancyInput.value.trim();

            if (!vacancyId) {
                alert('Vul eerst een vacancy ID in.');
                return;
            }

            step = 0;
            finished = false;
            document.getElementById('chat').innerHTML = '';
            document.getElementById('feedbackOutput').textContent = '';

            const response = await fetch(`/api/interviews/${vacancyId}/start`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();
            document.getElementById('chat').innerHTML += `<div class="bot">Victoria: ${data.reply ?? 'Geen antwoord ontvangen.'}</div>`;
            document.getElementById('message').disabled = false;
            document.querySelector('button[onclick="sendMessage()"]') .disabled = false;
        }

        async function sendMessage() {
            if (finished) return;

            const input = document.getElementById('message');
            const chat = document.getElementById('chat');
            const message = input.value.trim();

            if (!message || !vacancyId) return;

            chat.innerHTML += `<div class="user">Jij: ${message}</div>`;
            input.value = '';

            step++;

            const response = await fetch(`/api/interviews/${vacancyId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: message,
                    step: step
                })
            });

            const data = await response.json();

            chat.innerHTML += `<div class="bot">Victoria: ${data.reply ?? 'Geen antwoord ontvangen.'}</div>`;

            if (data.finished) {
                finished = true;
                input.disabled = true;
                document.querySelector('button[onclick="sendMessage()"]') .disabled = true;
                if (data.data && data.data.feedback) {
                    document.getElementById('feedbackOutput').textContent = JSON.stringify(data.data.feedback, null, 2);
                }
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
    </script>
</body>
</html>