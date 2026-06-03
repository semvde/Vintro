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

        $providedVoice = $validated['voice'] ?? null;
        $defaultVoice = env('ELEVENLABS_VOICE_ID');
        $isValidElevenLabsVoice = is_string($providedVoice)
            && preg_match('/^[A-Za-z0-9]{20}$/', $providedVoice) === 1;

        $voiceId = $isValidElevenLabsVoice ? $providedVoice : $defaultVoice;

        if (!$voiceId) {
            return response()->json([
                'error' => 'TTS configuration error',
                'details' => 'ELEVENLABS_VOICE_ID is missing and no valid voice was provided.',
            ], 500);
        }

        $response = Http::withHeaders([
            'xi-api-key' => env('ELEVENLABS_API_KEY'),
            'Accept' => 'audio/mpeg',
            'Content-Type' => 'application/json',
        ])->post(
            "https://api.elevenlabs.io/v1/text-to-speech/{$voiceId}",
            [
                'text' => $validated['text'],
                'model_id' => 'eleven_multilingual_v2',
                'voice_settings' => [
                    'stability' => 0.5,
                    'similarity_boost' => 0.75,
                ]
            ]
        );

        if ($response->failed()) {
            return response()->json([
                'error' => 'TTS request failed',
                'status' => $response->status(),
                'details' => $response->body(),
            ], $response->status());
        }

        return response($response->body(), 200)
            ->header('Content-Type', 'audio/mpeg')
            ->header('Content-Disposition', 'inline; filename="tts.mp3"');
    }
}