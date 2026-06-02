<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class QwenService
{
    public function chat(array $messages, int $maxTokens = 180, float $temperature = 0.4): string
    {
        $response = Http::withToken(env('HF_TOKEN'))
            ->timeout(120)
            ->post('https://router.huggingface.co/v1/chat/completions', [
                'model' => env('HF_MODEL'),
                'messages' => $messages,
                'temperature' => $temperature,
                'max_tokens' => $maxTokens,
                'stream' => false,
                'chat_template_kwargs' => [
                    'enable_thinking' => false,
                ],
            ]);

        if ($response->failed()) {
            throw new \Exception(json_encode([
                'status' => $response->status(),
                'details' => $response->json() ?? $response->body(),
            ]));
        }

        return trim(
            $response->json('choices.0.message.content')
            ?? $response->json('choices.0.message.reasoning_content')
            ?? ''
        );
    }
}