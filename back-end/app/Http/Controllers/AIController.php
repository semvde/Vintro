<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
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
- Stel maximaal één duidelijke vervolgvraag per antwoord.
- Geef concrete, haalbare stappen.
- Antwoord altijd in het Nederlands.
- Houd je antwoord kort en overzichtelijk.
- Wees positief, respectvol en niet veroordelend.
- Geef geen medisch, juridisch of financieel advies.
- Toon nooit je denkproces, reasoning of interne analyse.
- Geef alleen het uiteindelijke antwoord voor de gebruiker.

Antwoordstijl:
Rustig, vriendelijk, duidelijk en praktisch.
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
                'temperature' => 0.6,
                'max_tokens' => 350,
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