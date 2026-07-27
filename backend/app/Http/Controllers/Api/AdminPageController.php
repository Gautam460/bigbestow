<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class AdminPageController extends Controller
{
    public function index()
    {
        $pages = Page::orderBy('created_at', 'desc')->get();
        return response()->json($pages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'slug' => 'required|string|unique:pages',
            'title' => 'required|string',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $page = Page::create($request->all());
        return response()->json(['message' => 'Page created successfully', 'page' => $page], 201);
    }

    public function show($id)
    {
        $page = Page::findOrFail($id);
        return response()->json($page);
    }

    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $request->validate([
            'slug' => 'required|string|unique:pages,slug,' . $id,
            'title' => 'required|string',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $page->update($request->all());
        return response()->json(['message' => 'Page updated successfully', 'page' => $page]);
    }

    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();
        return response()->json(['message' => 'Page deleted successfully']);
    }
}
