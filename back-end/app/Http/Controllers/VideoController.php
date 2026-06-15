<?php

namespace App\Http\Controllers;

use App\Models\Video;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::with('category')
            ->latest()
            ->get();

        return response()->json([
            'data' => $videos
        ]);
    }

    public function show($id)
    {
        $video = Video::with('category')->find($id);

        if (!$video) {
            return response()->json([
                'message' => 'Video not found'
            ], 404);
        }

        return response()->json([
            'data' => $video
        ]);
    }
}
