<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TTSController extends Controller
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
}
