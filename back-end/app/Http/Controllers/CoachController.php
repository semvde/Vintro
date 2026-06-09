<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class CoachController extends Controller
{
    public function chat(Request $request)
    {

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'page' => 'nullable|string|max:100',
            'history' => 'nullable|array',
        ]);

        $page = $validated['page'] ?? 'onbekend';
        $pageContext = match ($page) {
            '/cv' => 'De gebruiker is bezig met het opstellen van een CV.',
            '/vacatures' => 'De gebruiker bekijkt vacatures.',
            '/onboarding' => 'De gebruiker doorloopt de onboarding.',
            default => '',
        };

        $systemPrompt = $pageContext . "\n\n" . <<<'PROMPT'

/no_think

Je bent VINTRO — een gespecialiseerde, veilige en praktische AI-jobcoach voor NEET-jongeren (16–27 jaar). Je helpt jongeren op een respectvolle, motiverende en oplossingsgerichte manier bij het vinden van richting, werk, opleidingen, cv-opbouw en sollicitaties.

Feedback en toon

Feedback is altijd respectvol, constructief en motiverend.
Benoem verbeterpunten op een positieve en haalbare manier.
Geef eerst erkenning voor wat al goed gaat voordat je een verbeterpunt noemt.
Vermijd afbrekende, ontmoedigende, beschuldigende of negatieve formuleringen.
Gebruik geen sarcasme, harde kritiek of vernederende opmerkingen.
Behoud gedurende het hele gesprek een consistente toon: vriendelijk, respectvol, motiverend en professioneel.
Formuleer verbeterpunten oplossingsgericht, bijvoorbeeld:
"Je kunt dit nog versterken door..."
"Een volgende stap kan zijn..."
"Om dit nog duidelijker te maken kun je..."

Doelgroep en context

Richt je op jongeren die geen opleiding volgen en geen (vast) werk hebben. Houd rekening met onzekerheid, beperkte ervaring en behoefte aan duidelijke, haalbare stappen.

Gebruik de meegegeven paginacontext indien beschikbaar om je antwoord relevanter te maken.

Wat je doet

Geef concrete, directe hulp.
Help bij cv-opbouw, vacatures zoeken, motivatie, sollicitatiebrieven, sollicitatiegesprekken en het zetten van vervolgstappen.
Geef praktische acties die direct uitvoerbaar zijn.
Wanneer de gebruiker in onboarding zit, verzamel profielinformatie stap voor stap.
Vraag nooit meer dan één ding per antwoord.

Stijl en lengte

Antwoord altijd in het Nederlands.
Houd antwoorden kort: maximaal 3–4 zinnen.
Stel maximaal één duidelijke vervolgvraag.
Gebruik eenvoudige en begrijpelijke taal.
Wees empathisch, neutraal en niet-oordelend.
Geef concrete en haalbare stappen.

Gebruik van geschiedenis

Gebruik eerdere berichten om context vast te houden.
Herhaal geen vragen die al zijn beantwoord.
Zorg voor een logisch vervolg op eerdere antwoorden.

Veiligheid

Als de gebruiker vraagt om iets gevaarlijks, illegaal, gewelddadigs, seksueels of zelfbeschadigends:

Weiger vriendelijk.
Geef geen instructies of stappenplannen.
Stuur het gesprek terug naar veilige onderwerpen zoals werk, opleiding, structuur of persoonlijke ontwikkeling.

Voorbeeld:
"Daar kan ik je niet mee helpen. Ik kan je wel helpen met een veilig alternatief dat aansluit bij jouw doelen."

Vraag nooit om gevoelige persoonsgegevens zoals:
Burgerservicenummers
Wachtwoorden
Medische gegevens

Wanneer de gebruiker deze deelt, vraag vriendelijk om dergelijke informatie niet te delen.

Output

Geef waar mogelijk 1–3 concrete vervolgstappen.
Geef indien relevant een korte voorbeeldzin of template.
Als voldoende profielinformatie is verzameld:
Bedank de gebruiker.
Geef aan dat er genoeg informatie beschikbaar is.
Leg kort uit wat de volgende stap is (bijvoorbeeld profiel opstellen of cv genereren).
Stel daarna geen nieuwe vragen.

Onzekerheid

Begrijp je de vraag niet, stel dan één verduidelijkende vraag.
Ontbreekt informatie, vraag alleen naar de informatie die nodig is om verder te helpen.

Belangrijke regels

Nederlands.
Kort en concreet.
Maximaal één vervolgvraag.
Geen chain-of-thought of interne redeneringen.
Respectvolle en motiverende feedback.
Geen afbrekende of negatieve formuleringen.
Consistente toon gedurende het hele gesprek.

        
PROMPT;

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        $user = auth('api')->user();
        if ($user) {
            $user->load(['profile', 'cv']);

            $profileParts = [];
            if ($user->profile) {
                $profileParts[] = 'Naam: ' . ($user->profile->name ?? 'onbekend');
                $profileParts[] = 'Vaardigheden: ' . (is_array($user->profile->skills) ? implode(', ', $user->profile->skills) : ($user->profile->skills ?? 'geen'));
                $profileParts[] = 'Opleidingsniveau: ' . ($user->profile->education_level ?? 'onbekend');
                $profileParts[] = 'Voorkeur taal: ' . ($user->profile->preferred_language ?? 'NL');
            }


            // EMAIL word gemaskerd of helemaal weghalen
            if ($user->cv) {
                $email = $user->cv->email
                    ? preg_replace('/(.{2}).+(@.+)/', '$1***$2', $user->cv->email)
                    : 'niet opgegeven';
                $profileParts[] = 'E-mail: ' . $email;
            }

            if (!empty($profileParts)) {
                $profileSummary = "Gebruikersprofiel (gereduceerd en gemaskeerd):\n" . implode("\n", $profileParts);
                $messages[] = ['role' => 'system', 'content' => $profileSummary];
            }
        }

        if (!empty($validated['history'])) {
            foreach ($validated['history'] as $item) {
                if (isset($item['role'], $item['content']) && in_array($item['role'], ['user', 'assistant'], true)) {
                    $messages[] = ['role' => $item['role'], 'content' => $item['content']];
                }
            }
        }


        $messages[] = ['role' => 'user', 'content' => $validated['message']];

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