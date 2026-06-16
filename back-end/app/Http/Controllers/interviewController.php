<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\InterviewFeedback;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class interviewController extends Controller
{
    public function start(Request $request, $vacancyId)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $vacancy = Vacancy::where('id', $vacancyId)
            ->where('user_id', $user->id)
            ->first();

        if (!$vacancy) {
            return response()->json([
                'message' => 'Vacancy not found'
            ], 404);
        }

        $interview = Interview::firstOrCreate(
            ['vacancy_id' => $vacancy->id],
            [
                'current_step' => 0,
                'chat_history' => [],
                'completed' => false,
            ]
        );

        $interviewerNames = [
            'Emma',
            'Sophie',
            'Julia',
            'Mila',
            'Lotte',
            'Noor',
            'Eva',
            'Sara',
            'Anna',
            'Tess',
        ];

        $interviewer = $interviewerNames[array_rand($interviewerNames)];

        $interview->update(['interviewer_name' => $interviewer]);

        return response()->json([
            'reply' => "Goedemiddag {$user->name}, mijn naam is {$interviewer} en ik doe vandaag het gesprek met u namens {$vacancy->company}. We spreken over de functie {$vacancy->title}. Fijn dat u er bent. Kunt u zichzelf kort introduceren en vertellen wat u naar deze functie heeft gebracht?",
            'type' => 'interview_start',
            'data' => [
                'interview' => $interview,
                'vacancy' => $vacancy,
                'interviewer' => $interviewer,
            ],
        ]);
    }

    public function chat(Request $request, $vacancyId)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'step' => 'required|integer',
        ]);

        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $vacancy = Vacancy::where('id', $vacancyId)
            ->where('user_id', $user->id)
            ->first();

        if (!$vacancy) {
            return response()->json([
                'message' => 'Vacancy not found'
            ], 404);
        }

        $interview = Interview::firstOrCreate(
            ['vacancy_id' => $vacancy->id],
            [
                'current_step' => 0,
                'chat_history' => [],
                'completed' => false,
            ]
        );

        $interviewer = $interview->interviewer_name ?? 'de interviewer';

        $minSteps = 5;
        $maxSteps = 11;

        $canFinish = $validated['step'] >= $minSteps;
        $mustFinish = $validated['step'] >= $maxSteps;

        $chatHistory = $interview->chat_history ?? [];

        $chatHistory[] = [
            'role' => 'user',
            'content' => $validated['message'],
            'step' => $validated['step'],
        ];

        $vacancyPayload = [
            'title' => $vacancy->title,
            'company' => $vacancy->company,
            'location' => $vacancy->location,
            'employment_type' => $vacancy->employment_type,
            'salary' => $vacancy->salary,
            'description' => $vacancy->description,
        ];

        $systemPrompt = <<<PROMPT
/no_think

Je bent {$interviewer}, HR-manager of lijnmanager bij {$vacancy->company}.
Je voert een sollicitatiegesprek met een kandidaat voor de functie {$vacancy->title}.

Jouw identiteit:
- Je naam is {$interviewer}, je werkt bij {$vacancy->company}.
- Je bent professioneel, maar ook gewoon een aardig mens. Vriendelijk, open, soms licht humoristisch.
- Je bent oprecht geïnteresseerd in de persoon — niet alleen in het cv.
- Je stelt mensen op hun gemak, niet onder druk.

Wat de kandidaat weet:
- Dit is een oefengesprek, maar jij speelt de rol volledig en realistisch.
- De naam van de kandidaat is bekend. Vraag daar nooit naar.

Gespreksstructuur (volg deze volgorde, maar laat het voelen als een gesprek, niet als een formulier):
1. Welkom en warming-up — stel de kandidaat op zijn/haar gemak
2. Motivatie — waarom deze functie, waarom dit bedrijf?
3. Werkervaring — wat heeft de kandidaat gedaan?
4. Vakinhoudelijke vragen — gericht op de functie
5. Gedragsvragen (STAR) — hoe pakt de kandidaat dingen aan?
6. Persoonlijk en buiten werk:
   - Wat doet de kandidaat graag in vrije tijd?
   - Hobby's, interesses, hoe oplaadt hij/zij?
   - Wat leer je buiten werk om?
   - Koppel antwoorden aan de functie waar het past — maar alleen als het natuurlijk voelt.
7. Samenwerking en teamfit
8. Sterke punten en iets om nog in te groeien
9. Ambitie — waar staat de kandidaat over 3 jaar?
10. Praktisch — beschikbaarheid, startdatum
11. Afsluiting — kandidaat de kans geven om zelf vragen te stellen

Gespreksregels:
- Één vraag per beurt. Altijd.
- Reageer kort op het antwoord (1 zin), dan de volgende vraag.
- Vraag door als een antwoord vaag of heel kort is — maar doe het luchtig: "Oh interessant, vertel daar eens meer over?" of "Hoe zag dat er in de praktijk uit?"
- Wissel af: soms een serieuze werkgerelateerde vraag, soms iets persoonlijks of gewoon leuks.
- Herhaal nooit vragen die al beantwoord zijn.
- Gebruik de vacaturedetails om vragen relevant en specifiek te maken.

Toon en stijl:
- Vriendelijk, toegankelijk, normaal — geen stijf HR-jargon.
- Spreek de kandidaat aan met "u", maar laat het niet stijf aanvoelen.
- Korte zinnen. Geen monologen.
- Je mag soms iets zeggen als: "Dat klinkt leuk, daar ben ik benieuwd naar." of "Ha, dat had ik niet verwacht!"
- Geen preek, geen coaching, geen tips.

Nooit doen:
- Nooit coaching geven of uitleggen hoe het beter kan.
- Nooit de naam vragen.
- Nooit zeggen dat dit een oefening is.
- Nooit meerdere vragen tegelijk stellen.
- Nooit je eigen denkproces tonen of uitleggen wat je nu gaat doen.

Afsluiting (als het gesprek klaar is):
- Bedank de kandidaat warm en oprecht.
- Geef aan dat er contact opgenomen wordt.
- Geen nieuwe vragen meer.
- Voorbeeld: "Fijn gesprek gehad! We nemen binnenkort contact met u op over de volgende stappen. Heeft u zelf nog iets wat u wil vragen of kwijt?"
PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
            [
                'role' => 'system',
                'content' => json_encode([
                    'instruction' => 'Gebruik deze vacaturedetails om het gesprek zo realistisch en relevant mogelijk te maken.',
                    'vacancy' => $vacancyPayload,
                ], JSON_UNESCAPED_UNICODE),
            ],
            [
                'role' => 'system',
                'content' => $mustFinish
                    ? 'Rond het gesprek nu professioneel af. Stel geen nieuwe vragen meer. Bedank de kandidaat en sluit het gesprek zakelijk af.'
                    : (
                        $canFinish
                        ? 'Je mag het gesprek afronden als de belangrijkste onderwerpen (motivatie, ervaring, vaardigheden, persoonlijkheid, samenwerking, beschikbaarheid) voldoende aan bod zijn gekomen. Als er nog een essentieel onderwerp ontbreekt, stel dan nog één gerichte vraag.'
                        : 'Stel één gerichte, professionele interviewvraag die aansluit op de vacature en het gesprek tot nu toe. Wissel vakinhoudelijke vragen af met persoonlijke vragen over karakter, hobby\'s of leven buiten het werk. Vraag niet naar de naam.'
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
                'max_tokens' => 150,
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
            'contact met u op',
            'nemen contact op',
            'vervolgstappen',
            'hartelijk dank voor uw tijd',
            'bedankt voor het gesprek',
            'we laten u weten',
            'succes gewenst',
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

        $interview->update([
            'current_step' => $validated['step'],
            'chat_history' => $chatHistory,
            'completed' => $isFinished,
            'completed_at' => $isFinished ? now() : null,
        ]);

        $feedback = null;

        if ($isFinished) {
            $feedback = $this->generateAndStoreFeedback($interview, $vacancy, $chatHistory, $interviewer);
        }

        return response()->json([
            'reply' => trim($reply),
            'finished' => $isFinished,
            'next_action' => $isFinished ? 'generate_interview_feedback' : 'continue_interview',
            'data' => [
                'interview' => $interview,
                'vacancy' => $vacancy,
                'feedback' => $feedback,
            ],
        ]);
    }

    private function generateAndStoreFeedback(Interview $interview, Vacancy $vacancy, array $chatHistory, string $interviewer = 'de interviewer')
    {
    $feedbackPrompt = <<<PROMPT
    /no_think

    Je bent Victoria, een neutrale sollicitatiecoach voor jongeren.

    Je beoordeelt een zojuist afgerond sollicitatiegesprek.
    Het gesprek werd gevoerd door interviewer {$interviewer} namens {$vacancy->company} voor de functie {$vacancy->title}.

    Je krijgt:
    1. De vacature.
    2. De chatgeschiedenis van het interview.

    Belangrijk:
    - Baseer je uitsluitend op de chatgeschiedenis en de vacaturedetails.
    - Verzin geen informatie die niet in het gesprek naar voren is gekomen.
    - Beoordeel zowel inhoud als communicatie.
    - Geef feedback alsof je direct tegen de gebruiker praat.
    - Wees vriendelijk, eerlijk, concreet en praktisch.

    Return alleen geldige JSON in deze exacte structuur:
    {
    "accepted": false,
    "feedback": {
        "reaction": "korte algemene reactie op het interview",
        "good_points": ["wat ging goed in het gesprek"],
        "improvement_points": ["wat kan beter in het gesprek"],
        "communication_feedback": ["feedback op communicatie, duidelijkheid en houding"],
        "personal_presentation": ["hoe de kandidaat zichzelf als persoon/professional neerzette"],
        "next_interview_tips": ["concrete tips voor een volgend sollicitatiegesprek"]
    }
    }

    Regels:
    - accepted is true als de kandidaat overtuigend, concreet en passend bij de vacature heeft geantwoord.
    - accepted is false als antwoorden te vaag, te kort of onvoldoende onderbouwd waren.
    - Noem concrete punten uit het gesprek.
    - Geen markdown.
    - Geen uitleg buiten JSON.
    PROMPT;

        $messages = [
            [
                'role' => 'system',
                'content' => $feedbackPrompt,
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'vacancy' => [
                        'title' => $vacancy->title,
                        'company' => $vacancy->company,
                        'location' => $vacancy->location,
                        'employment_type' => $vacancy->employment_type,
                        'salary' => $vacancy->salary,
                        'description' => $vacancy->description,
                    ],
                    'chat_history' => $chatHistory,
                ], JSON_UNESCAPED_UNICODE),
            ],
        ];

        $response = Http::withToken(env('HF_TOKEN'))
            ->timeout(120)
            ->post('https://router.huggingface.co/v1/chat/completions', [
                'model' => env('HF_MODEL'),
                'messages' => $messages,
                'temperature' => 0.2,
                'max_tokens' => 500,
                'stream' => false,
                'chat_template_kwargs' => [
                    'enable_thinking' => false,
                ],
            ]);

        if ($response->failed()) {
            return [
                'error' => 'Hugging Face request failed',
                'status' => $response->status(),
            ];
        }

        $content = $response->json('choices.0.message.content')
            ?? $response->json('choices.0.message.reasoning_content')
            ?? '';

        $content = trim($content);
        $content = preg_replace('/^```json\s*/i', '', $content);
        $content = preg_replace('/^```\s*/', '', $content);
        $content = preg_replace('/\s*```$/', '', $content);

        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return [
                'error' => 'AI gaf geen geldige JSON terug.',
                'raw' => $content,
            ];
        }

        $feedback = InterviewFeedback::updateOrCreate(
            ['interview_id' => $interview->id],
            [
                'ai_feedback' => json_encode($data['feedback'] ?? [], JSON_UNESCAPED_UNICODE),
                'accepted' => (bool) ($data['accepted'] ?? false),
            ]
        );

        return [
            'id' => $feedback->id,
            'interview_id' => $feedback->interview_id,
            'ai_feedback' => json_decode($feedback->ai_feedback, true),
            'accepted' => $feedback->accepted,
            'created_at' => $feedback->created_at,
        ];
    }
}