<?php
// OUD BESTAND VOOR BACKUPS, NIET GEBRUIKEN 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{

    public function tts(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:5000',
            'voice' => 'nullable|string|max:50',
        ]);

        $response = Http::withToken(env('HF_TOKEN'))
            ->timeout(120)
            ->withHeaders([
                'Accept' => 'audio/wav',
            ])
            ->post('https://api-inference.huggingface.co/models/' . env('HF_TTS_MODEL', 'hexgrad/Kokoro-82M'), [
                'inputs' => $validated['text'],
                'parameters' => [
                    'voice' => $validated['voice'] ?? 'af_heart',
                ],
            ]);

        if ($response->failed()) {
            return response()->json([
                'error' => 'TTS request failed',
                'status' => $response->status(),
                'details' => $response->json() ?? $response->body(),
            ], $response->status());
        }

        return response($response->body(), 200)
            ->header('Content-Type', 'audio/wav');
    }
    
    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'context' => 'nullable|string|max:10000',
        ]);

        $systemPrompt = <<<'PROMPT'
/no_think

Je bent VINTRO, een rustige, betrouwbare en praktische AI-coach voor NEET-jongeren van 16 tot 27 jaar.

Doelgroep:
Jongeren die geen opleiding volgen, geen werk hebben en onzeker kunnen zijn over hun toekomst.

Jouw rol:
- Help de gebruiker richting werk, opleiding of training.
- Help met motivatie, structuur, sollicitaties, CV's en zelfvertrouwen.
- Antwoord altijd in het Nederlands.
- Houd antwoorden kort: maximaal 4 zinnen.
- Stel maximaal één duidelijke vervolgvraag.
- Wees positief, respectvol en niet veroordelend.
- Geef concrete, haalbare stappen.
- Toon nooit je denkproces, reasoning of interne analyse.

Veiligheid:
Als de gebruiker vraagt om iets gevaarlijks, illegaals, gewelddadigs, zelfbeschadigends of seksueels:
- Geef geen uitleg, stappenplan of details.
- Antwoord kort.
- Zeg dat je daar niet mee kunt helpen.
- Stuur het gesprek terug naar werk, opleiding, hobby's, structuur of veilige doelen.

Voorbeeld:
"Daar kan ik je niet mee helpen. Ik kan je wel helpen zoeken naar iets veiligs dat bij je interesses past. Wat vind je leuk om te doen?"

Onboarding-stijl:
- Begeleid de gebruiker stap voor stap.
- Vraag steeds maar één ding tegelijk.
- Verzamel informatie over interesses, opleiding, werkervaring, sterke punten, uitdagingen en doelen.

Antwoordstijl:
Rustig, vriendelijk, duidelijk en praktisch.
Geef alleen het uiteindelijke antwoord voor de gebruiker.
PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
        ];

        if (!empty($validated['context'])) {
            $messages[] = [
                'role' => 'system',
                'content' => 'Extra context over de gebruiker of sessie: ' . $validated['context'],
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $validated['message'],
        ];

        $response = Http::withToken(env('HF_TOKEN'))
            ->timeout(120)
            ->post('https://router.huggingface.co/v1/chat/completions', [
                'model' => env('HF_MODEL'),
                'messages' => $messages,
                'temperature' => 0.4,
                'max_tokens' => 180,
                'stream' => false,
                'chat_template_kwargs' => [
                    'enable_thinking' => false,
                ],
            ]);

        if ($response->failed()) {
            return response()->json([
                'error' => 'Hugging Face request failed',
                'status' => $response->status(),
                'details' => $response->json() ?? $response->body(),
            ], $response->status());
        }

        $reply = $response->json('choices.0.message.content')
            ?? $response->json('choices.0.message.reasoning_content')
            ?? 'Er ging iets mis bij het ophalen van het AI-antwoord.';

        return response()->json([
            'reply' => trim($reply),
        ]);
    }
}