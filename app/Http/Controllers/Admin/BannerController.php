<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::latest()->get();

        return Inertia::render('Admin/Banners/Index', [
            'banners' => $banners,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'status' => 'nullable',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120';
        } else {
            $rules['image'] = 'required|string|url';
        }

        $request->validate($rules);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/'.$request->file('image')->store('banners', 'public');
        } elseif ($request->filled('image') && is_string($request->image)) {
            $imagePath = trim($request->image);
        }

        Banner::create([
            'title' => $request->title,
            'image' => $imagePath,
            'link' => $request->link,
            'status' => $request->boolean('status', true),
        ]);

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    public function update(Request $request, Banner $banner)
    {
        $rules = [
            'title' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'status' => 'nullable',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120';
        } elseif ($request->filled('image')) {
            $rules['image'] = 'string';
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

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }
}
