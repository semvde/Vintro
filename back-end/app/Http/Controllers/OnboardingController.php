<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\OnboardingSession;

class OnboardingController extends Controller
{
    public function start(Request $request)
    {
        $user = auth('api')->user();

        $session = OnboardingSession::firstOrCreate(
            ['user_id' => $user->id, 'completed' => false],
            [
                'current_step' => 0,
                'max_steps' => 20,
                'chat_history' => [],
                'completed' => false,
            ]
        );

        return response()->json([
            'reply' => "Hoi {$user->name}, ik ben Victoria. Ik help je stap voor stap om je voor te bereiden op solliciteren. We bouwen eerst een werkprofiel op, zodat we daarna een eerste CV kunnen maken en je sollicitaties kunt oefenen. Om te beginnen: hoe oud ben je?",
            'type' => 'onboarding_start',
        ]);
    }

    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'step' => 'required|integer',
            'max_steps' => 'required|integer',
        ]);

        $user = auth('api')->user();

        $session = OnboardingSession::firstOrCreate(
            ['user_id' => $user->id, 'completed' => false],
            [
                'current_step' => 0,
                'max_steps' => $validated['max_steps'],
                'chat_history' => [],
                'completed' => false,
            ]
        );

        $minSteps = 8;
        $maxSteps = $session->max_steps;

        $canFinish = $validated['step'] >= $minSteps;
        $mustFinish = $validated['step'] >= $maxSteps;

        $chatHistory = $session->chat_history ?? [];

        $chatHistory[] = [
            'role' => 'user',
            'content' => $validated['message'],
            'step' => $validated['step'],
        ];

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

1. Geboortedatum of leeftijd 
2. laatste opleiding of schoolervaring
3. werkervaring, stage of vrijwilligerswerk
4. per ervaring:
   - bedrijfsnaam of organisatie
   - functie/rol
   - periode, als de gebruiker dit weet
   - taken of wat de gebruiker daar heeft geleerd
5. taken die de gebruiker eerder heeft gedaan
6. interesses
7. vaardigheden
8. sterke punten
9. wat de gebruiker lastig vindt aan solliciteren
10. welk soort werk de gebruiker wil oefenen of ontdekken

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
- Als de gebruiker werkervaring noemt, vraag kort door naar functie, bedrijf, periode en taken. Vraag niet alles tegelijk; stel één vraag per keer.

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
                'content' => $mustFinish
                    ? 'Rond de onboarding nu af. Stel geen nieuwe vraag meer.'
                    : (
                        $canFinish
                        ? 'Je mag de onboarding afronden als er genoeg informatie is voor een werkprofiel en eerste CV. Als er nog belangrijke informatie ontbreekt, stel dan nog één korte vraag.'
                        : 'Stel één korte vraag die helpt om informatie te verzamelen voor een werkprofiel, CV of sollicitatie-oefening. Vraag niet naar de naam.'
                    ),
            ],
        ];

        foreach ($chatHistory as $item) {
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

        $finishKeywords = [
            'genoeg informatie',
            'werkprofiel opbouwen',
            'eerste cv',
            'cv genereren',
        ];

        $aiFinished = false;

        foreach ($finishKeywords as $keyword) {
            if (str_contains(strtolower($reply), $keyword)) {
                $aiFinished = true;
                break;
            }
        }

        $isFinished = $mustFinish || ($canFinish && $aiFinished);
        $chatHistory[] = [
            'role' => 'assistant',
            'content' => trim($reply),
            'step' => $validated['step'],
        ];

        $session->update([
            'current_step' => $validated['step'],
            'chat_history' => $chatHistory,
            'completed' => $isFinished,
            'completed_at' => $isFinished ? now() : null,
        ]);


        // aangepast door jeff, seeder voor vacancies
        if ($isFinished) {
            $user->update([
                'onboarded' => true,
            ]);

            // prevent duplicates
            if ($user->vacancies()->count() === 0) {

                \App\Models\Vacancy::factory()
                    ->count(15)
                    ->create([
                        'user_id' => $user->id,
                    ]);
            }
        }

        return response()->json([
            'reply' => trim($reply),
            'finished' => $isFinished,
            'next_action' => $isFinished ? 'generate_profile' : 'continue_onboarding',
        ]);
    }
}