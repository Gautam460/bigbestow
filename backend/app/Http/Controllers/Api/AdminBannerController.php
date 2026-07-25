<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class AdminBannerController extends Controller
{
    public function index()
    {
        return response()->json(Banner::latest()->get());
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120';
        } else {
            $rules['image'] = 'required|string';
        }

        $request->validate($rules);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/'.$request->file('image')->store('banners', 'public');
        } elseif ($request->filled('image') && is_string($request->image)) {
            $imagePath = trim($request->image);
        }

        $banner = Banner::create([
            'title' => $request->title,
            'image' => $imagePath,
            'link' => $request->link,
            'status' => $request->boolean('status', true),
        ]);

        return response()->json($banner, 201);
    }

    public function show(Banner $banner)
    {
        return response()->json($banner);
    }

    public function update(Request $request, Banner $banner)
    {
        $rules = [
            'title' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120';
        }

        $request->validate($rules);

        $imagePath = $banner->image;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/'.$request->file('image')->store('banners', 'public');
        } elseif ($request->filled('image') && is_string($request->image)) {
            $imagePath = trim($request->image);
        }

        $banner->update([
            'title' => $request->title,
            'image' => $imagePath,
            'link' => $request->link,
            'status' => $request->boolean('status', true),
        ]);

        return response()->json($banner);
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return response()->json(null, 204);
    }
}
