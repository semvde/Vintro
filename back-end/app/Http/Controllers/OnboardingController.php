<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OnboardingController extends Controller
{
    public function start()
    {
        return response()->json([
            'reply' => 'Hoi, ik ben VINTRO. Ik stel je een paar korte vragen zodat ik straks een profiel en eerste CV voor je kan opbouwen. We doen dit stap voor stap. Om te beginnen: wat vind je leuk om te doen?',
            'type' => 'onboarding_start',
        ]);
    }

    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'step' => 'required|integer',
            'max_steps' => 'required|integer',
            'history' => 'nullable|array',
        ]);

        $isLastStep = $validated['step'] >= $validated['max_steps'];

        $systemPrompt = <<<'PROMPT'
/no_think

Je bent VINTRO, een rustige, betrouwbare en praktische AI-coach voor NEET-jongeren van 16 tot 27 jaar.

Doelgroep:
Jongeren die geen opleiding volgen, geen werk hebben en onzeker kunnen zijn over hun toekomst.

Jouw doel:
Je helpt de gebruiker stap voor stap richting werk, opleiding of persoonlijke ontwikkeling.

Tijdens de onboarding verzamel je informatie om:
- een persoonlijk profiel op te bouwen
- een eerste CV te genereren
- passende vacatures te vinden
- toekomstige sollicitatieoefeningen te personaliseren

Jouw rol:
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
- Verzamel informatie over:
  - interesses
  - opleiding
  - werkervaring
  - sterke punten
  - uitdagingen
  - doelen
  - voorkeuren voor werk

- Herhaal geen vragen die al beantwoord zijn.
- Bouw logisch verder op eerdere antwoorden.
- Houd het gesprek natuurlijk en menselijk.

Wanneer je voldoende informatie hebt:
- Bedank de gebruiker.
- Geef aan dat er genoeg informatie is verzameld.
- Zeg dat er nu een profiel opgebouwd kan worden.
- Zeg dat daarna een eerste CV gegenereerd kan worden.
- Stel geen nieuwe vraag meer.

Antwoordstijl:
Rustig, vriendelijk, duidelijk en praktisch.
Geef alleen het uiteindelijke antwoord voor de gebruiker.
PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
            [
                'role' => 'system',
                'content' => $isLastStep
                    ? 'Dit is de laatste onboarding-stap. Rond het gesprek natuurlijk en vriendelijk af.'
                    : 'Dit is onboarding stap ' . $validated['step'] . ' van ' . $validated['max_steps'] . '. Stel één korte vervolgvraag om profielinformatie te verzamelen.',
            ],
        ];

        if (!empty($validated['history'])) {
            foreach ($validated['history'] as $item) {
                if (
                    isset($item['role'], $item['content']) &&
                    in_array($item['role'], ['user', 'assistant'], true)
                ) {
                    $messages[] = [
                        'role' => $item['role'],
                        'content' => $item['content'],
                    ];
                }
            }
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
            'finished' => $isLastStep,
        ]);
    }
}