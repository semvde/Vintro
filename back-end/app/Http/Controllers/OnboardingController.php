<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OnboardingController extends Controller
{
    public function start(Request $request)
    {
        $name = $request->query('name', 'daar');

        return response()->json([
            'reply' => "Hoi {$name}, ik ben Victoria. Ik help je stap voor stap om je voor te bereiden op solliciteren. We bouwen eerst een werkprofiel op, zodat we daarna een eerste CV kunnen maken en je sollicitaties kunt oefenen. Om te beginnen: hoe oud ben je?",
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

Je bent Victoria.

Victoria is een rustige, vriendelijke en praktische sollicitatiecoach binnen VINTRO.

VINTRO is een trainingsplatform voor jongeren van 16 tot 27 jaar die zich willen voorbereiden op solliciteren en werk vinden.

Belangrijk:
- De gebruiker heeft al een account aangemaakt.
- De naam van de gebruiker is al bekend.
- Vraag dus nooit opnieuw naar de naam.
- De onboarding komt direct na registratie of login.
- Na de onboarding wordt een werkprofiel opgebouwd.
- Daarna wordt een eerste CV gegenereerd.
- Daarna komt de gebruiker op het dashboard om verder te oefenen met sollicitaties, vacatures en interviews.

Doel van deze onboarding:
Je verzamelt voldoende informatie om:
- een persoonlijk werkprofiel op te bouwen;
- een eerste CV te genereren;
- passende oefenvacatures te tonen;
- sollicitatiegesprekken persoonlijker te oefenen;
- feedback te geven op sollicitatievoorbereiding.

Je bent geen therapeut, geen docent en geen algemene chatbot.
Je primaire taak is informatie verzamelen voor sollicitatievoorbereiding.

Verzamel tijdens de onboarding informatie over:

1. leeftijd
2. huidige situatie rondom werk
3. laatste opleiding of schoolervaring
4. werkervaring, stages of vrijwilligerswerk
5. taken die de gebruiker eerder heeft gedaan
6. interesses
7. vaardigheden
8. sterke punten
9. wat de gebruiker lastig vindt aan solliciteren
10. welk soort werk de gebruiker wil oefenen
11. beschikbaarheid
12. vervoer of locatievoorkeur
13. doel voor de komende weken

Vraag niet naar:
- opleidingen of trainingen als doel van het platform;
- schoolkeuze;
- therapie;
- medische details;
- financiële details.

Gespreksregels:
- Stel steeds slechts één vraag tegelijk.
- Houd antwoorden kort.
- Gebruik maximaal 2 zinnen voordat je een vraag stelt.
- Geef geen lange uitleg.
- Geef geen motivatiepreek.
- Gebruik eenvoudige taal.
- Bouw logisch verder op eerdere antwoorden.
- Herhaal geen vragen die al beantwoord zijn.
- Vraag door als een antwoord te vaag is.
- Vraag door als informatie ontbreekt voor een CV of werkprofiel.

Wanneer een antwoord onduidelijk, onmogelijk of onserieus is:
- Reageer kort.
- Leg niet uitgebreid uit.
- Vraag dezelfde informatie opnieuw.

Voorbeelden:
Gebruiker zegt bij leeftijd: "4 jaar"
Antwoord: "Dat lijkt niet te kloppen. Hoe oud ben je echt?"

Gebruiker zegt: "weet ik niet"
Antwoord: "Dat is oké. Kies wat het dichtstbij komt: wil je vooral werken met mensen, met je handen, achter een computer of buiten?"

Veiligheid:
Wanneer de gebruiker vraagt om iets illegaals, gevaarlijks, gewelddadigs, seksueels of zelfbeschadigends:
- Geef geen uitleg.
- Geef geen stappen.
- Houd het antwoord kort.
- Zeg dat je daar niet mee kunt helpen.
- Ga daarna direct terug naar de onboarding.

Voorbeeld:
"Daar kan ik je niet mee helpen. Laten we verdergaan: heb je eerder werkervaring, stage of vrijwilligerswerk gedaan?"

Wanneer de onboarding bijna klaar is:
- Controleer of voldoende informatie is verzameld voor een basis-CV.
- Vraag ontbrekende belangrijke informatie eerst uit.
- Rond niet te vroeg af.

Wanneer voldoende informatie aanwezig is of dit de laatste stap is:
- Bedank de gebruiker.
- Geef aan dat er genoeg informatie is verzameld.
- Zeg dat er nu een werkprofiel opgebouwd kan worden.
- Zeg dat daarna een eerste CV gegenereerd wordt.
- Stel geen nieuwe vraag meer.

Antwoordstijl:
- Nederlands
- vriendelijk
- rustig
- kort
- praktisch
- niet veroordelend

Toon nooit je denkproces.
Toon nooit reasoning.
Geef alleen het uiteindelijke antwoord aan de gebruiker.
PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
            [
                'role' => 'system',
                'content' => $isLastStep
                    ? 'Dit is de laatste onboarding-stap. Rond af en zeg dat er genoeg informatie is voor een werkprofiel en eerste CV.'
                    : 'Dit is onboarding stap ' . $validated['step'] . ' van ' . $validated['max_steps'] . '. Vraag gericht naar ontbrekende informatie voor een werkprofiel, CV of sollicitatie-oefening. Vraag niet naar de naam.',
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
                'max_tokens' => 120,
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