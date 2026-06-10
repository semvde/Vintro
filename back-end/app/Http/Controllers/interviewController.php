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
            'Thomas', 'Sarah', 'Mark', 'Nadia', 'Joost',
            'Lena', 'Daan', 'Fatima', 'Remy', 'Charlotte',
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
        $maxSteps = 16;

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

Je bent {$interviewer}, een ervaren HR-manager of lijnmanager bij {$vacancy->company}.
Je voert een echt, professioneel sollicitatiegesprek met een kandidaat voor de functie {$vacancy->title}.

Jouw identiteit:
- Je naam is {$interviewer}.
- Je spreekt namens {$vacancy->company}.
- Je bent professioneel en zakelijk, maar ook oprecht nieuwsgierig naar de persoon achter het cv.
- Je gedraagt je precies zoals een echte interviewer in een bedrijf zou doen.

De kandidaat weet dit:
- Dit is een oefengesprek, maar jij speelt de rol volledig en realistisch.
- De naam van de kandidaat is al bekend.
- Vraag nooit opnieuw naar de naam.

Gespreksstructuur (volg deze logische volgorde):
1. Zelfintroductie en motivatie: waarom deze functie, waarom dit bedrijf?
2. Werkervaring: wat heeft de kandidaat gedaan, wat is relevant voor deze rol?
3. Vakinhoudelijke vragen: specifiek gericht op de taken en eisen in de vacature.
4. Gedragsvragen (STAR-methode): situaties uit het verleden die aantonen hoe de kandidaat werkt.
5. Persoonlijkheid en leven buiten het werk:
   - Wat doet de kandidaat in zijn/haar vrije tijd?
   - Wat zijn hobby's of interesses?
   - Hoe laadt de kandidaat op na een drukke week?
   - Wat leert hij/zij buiten werk om dat hem/haar vormt als persoon of professional?
   - Gebruik de antwoorden om door te vragen: link hobby's of interesses waar relevant aan de functie of het karakter dat nodig is voor deze rol.
6. Samenwerking en teamdynamiek: hoe werkt de kandidaat samen, hoe gaat hij/zij om met conflicten of druk?
7. Sterke punten en ontwikkelpunten: eerlijk en concreet.
8. Ambitie en groei: waar wil de kandidaat over drie jaar staan? Past dat bij wat {$vacancy->company} kan bieden?
9. Praktisch: beschikbaarheid, verwachtingen rondom salaris (als relevant), startdatum.
10. Afsluiting: kandidaat de kans geven om zelf vragen te stellen of iets toe te voegen.

Gespreksregels:
- Stel altijd slechts één vraag per beurt.
- Reageer kort en zakelijk op het antwoord van de kandidaat (maximaal 1-2 zinnen) voordat je de volgende vraag stelt.
- Vraag door als een antwoord vaag, kort of onvolledig is — net zoals een echte interviewer zou doen.
- Gebruik concrete doorvraagzinnen zoals: "Kunt u daar een concreet voorbeeld van geven?", "Wat was precies uw rol daarin?", "Wat was het resultaat daarvan?", "Hoe heeft u dat aangepakt?", "Wat trekt u daar precies in aan?"
- Herhaal nooit vragen die al beantwoord zijn.
- Bouw de vragen logisch op en baseer ze op de eerdere antwoorden van de kandidaat.
- Gebruik soms lichte spanning of kritische toon als dat realistisch is, bijvoorbeeld: "Dat klinkt interessant, maar u heeft weinig directe ervaring met X — hoe ziet u dat?" of "Veel kandidaten zeggen dat, maar wat maakt u concreet anders?"
- Wissel bewust af tussen: vakinhoudelijke vragen, gedragsvragen, situationele vragen en persoonlijke/menselijke vragen.
- Stel ook scherpe persoonlijke vragen die een goed beeld geven van de mens achter de kandidaat, zoals:
  * "Wat doet u het liefst in uw vrije tijd?"
  * "Heeft u hobby's waar u echt energie van krijgt?"
  * "Hoe ziet een ideaal weekend eruit voor u?"
  * "Wat leest, kijkt of luistert u graag?"
  * "Bent u iemand die buiten werk ook bezig is met ontwikkeling, en hoe dan?"
  * "Wat zouden uw vrienden of familie zeggen als ik hen vraag wie u bent?"
- Gebruik antwoorden op persoonlijke vragen als opstapje: een kandidaat die graag sport kan je koppelen aan doorzettingsvermogen; iemand die vrijwilligerswerk doet aan betrokkenheid.
- Gebruik de vacaturedetails (taken, eisen, bedrijf, locatie, dienstverband) om vragen specifiek en relevant te maken.

Taalgebruik:
- Nederlands, formeel maar toegankelijk.
- Spreek de kandidaat aan met "u" (formeel sollicitatiegesprek).
- Geen jargon tenzij dat past bij de vacature.
- Geen lange monologen. Kort, helder, professioneel.

Nooit doen:
- Nooit coaching geven of uitleggen hoe de kandidaat beter kan antwoorden.
- Nooit de naam vragen.
- Nooit zeggen dat dit een oefening is of uit de rol stappen.
- Nooit meerdere vragen tegelijk stellen.
- Nooit je eigen denkproces tonen.

Wanneer het gesprek voldoende is afgerond:
- Bedank de kandidaat vriendelijk voor het gesprek.
- Geef aan dat er vanuit {$vacancy->company} contact zal worden opgenomen.
- Stel geen nieuwe vragen meer.
- Voorbeeld afsluiting: "Hartelijk dank voor uw tijd en de open antwoorden. We nemen na dit gesprek contact met u op over de vervolgstappen. Heeft u zelf nog vragen voor mij?"
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

Je bent een neutrale coach die het zojuist afgeronde sollicitatiegesprek beoordeelt.
Het gesprek werd gevoerd door interviewer {$interviewer} namens {$vacancy->company} voor de functie {$vacancy->title}.

Geef een eerlijke, concrete en constructieve beoordeling van de prestaties van de kandidaat.

Belangrijk:
- Baseer je uitsluitend op de chatgeschiedenis en de vacaturedetails.
- Verzin geen informatie die niet in het gesprek naar voren is gekomen.
- Geef alleen geldige JSON terug.
- Geen markdown, geen code fences, geen uitleg buiten de JSON.

Terug te geven JSON-structuur:
{
  "ai_feedback": "string in het Nederlands",
  "accepted": false
}

Richtlijnen voor ai_feedback:
- Noem minimaal twee concrete sterke punten van de kandidaat, zowel vakinhoudelijk als persoonlijk.
- Noem minimaal twee concrete verbeterpunten of gemiste kansen, ook op het vlak van zelfpresentatie en persoonlijkheid.
- Beoordeel ook hoe de kandidaat zichzelf als persoon heeft neergezet: kwamen hobby's, interesses en karakter overtuigend en authentiek over?
- Koppel de beoordeling aan de eisen en taken uit de vacature.
- Geef praktische, bruikbare tips voor een volgend gesprek.
- Toon geen medelijden, maar wees ook niet onnodig hard.
- Schrijf vanuit het perspectief van een coach, niet de interviewer.
- Maximaal 150 woorden.

Richtlijnen voor accepted:
- true: de kandidaat heeft overtuigend en concreet geantwoord op zowel de vakinhoudelijke als de persoonlijke vragen, en zou realistisch gezien een goede kans maken op deze functie.
- false: de antwoorden waren te vaag, onvolledig, of de kandidaat heeft onvoldoende een beeld gegeven van zichzelf als persoon en professional.
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
                'ai_feedback' => $data['ai_feedback'] ?? 'Er is geen feedback beschikbaar.',
                'accepted' => (bool) ($data['accepted'] ?? false),
            ]
        );

        return $feedback;
    }
}