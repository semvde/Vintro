<?php

namespace App\Http\Controllers;

use App\Services\QwenService;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function start()
    {
        return response()->json([
            'reply' => 'Hoi, ik ben VINTRO. Ik stel je een paar korte vragen zodat ik straks een profiel en eerste CV voor je kan opbouwen. We doen dit stap voor stap. Om te beginnen: wat vind je leuk om te doen?',
            'type' => 'onboarding_start',
            'finished' => false,
        ]);
    }

    public function chat(Request $request, QwenService $qwen)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'step' => 'required|integer|min:1',
            'max_steps' => 'required|integer|min:1',
            'history' => 'nullable|array',
        ]);

        $isLastStep = $validated['step'] >= $validated['max_steps'];

        $systemPrompt = <<<'PROMPT'
/no_think

Je bent VINTRO, een rustige Nederlandse onboarding-coach voor NEET-jongeren van 16 tot 27 jaar.

Doel:
Je verzamelt stap voor stap informatie zodat VINTRO daarna een profiel en eerste CV kan opbouwen.

Verzamel informatie over:
- interesses
- opleiding
- werkervaring
- sterke punten
- uitdagingen
- doelen
- voorkeur voor werk

Regels:
- Antwoord altijd in het Nederlands.
- Houd het kort: maximaal 4 zinnen.
- Stel maximaal één vervolgvraag.
- Wees vriendelijk, concreet en niet veroordelend.
- Toon nooit je denkproces of reasoning.
- Geef geen gevaarlijke, illegale, medische, juridische of financiële adviezen.

Als dit de laatste onboarding-stap is:
- Stel geen nieuwe vraag meer.
- Bedank de gebruiker.
- Zeg dat je genoeg informatie hebt om een profiel op te bouwen.
- Zeg dat daarna een eerste CV gemaakt kan worden.
PROMPT;

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            [
                'role' => 'system',
                'content' => $isLastStep
                    ? 'Dit is de laatste onboarding-stap. Rond het gesprek natuurlijk af.'
                    : 'Dit is onboarding stap ' . $validated['step'] . ' van ' . $validated['max_steps'] . '. Stel één korte vervolgvraag.',
            ],
        ];

        foreach ($validated['history'] ?? [] as $item) {
            if (isset($item['role'], $item['content']) && in_array($item['role'], ['user', 'assistant'], true)) {
                $messages[] = [
                    'role' => $item['role'],
                    'content' => $item['content'],
                ];
            }
        }

        $messages[] = [
            'role' => 'user',
            'content' => $validated['message'],
        ];

        try {
            $reply = $qwen->chat($messages);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'AI request failed',
                'details' => json_decode($e->getMessage(), true) ?? $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'reply' => $reply,
            'type' => $isLastStep ? 'onboarding_finished' : 'onboarding_message',
            'finished' => $isLastStep,
            'next_action' => $isLastStep ? 'generate_profile' : 'continue_onboarding',
        ]);
    }
}