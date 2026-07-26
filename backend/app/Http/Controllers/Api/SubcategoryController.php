<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubcategoryController extends Controller
{
    public function index()
    {
        return response()->json(Subcategory::with('category')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subcategories',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:51200',
        ]);

        $data = [
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'category_id' => $validated['category_id'],
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('subcategories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $subcategory = Subcategory::create($data);

        return response()->json($subcategory->load('category'), 201);
    }

    public function show(Subcategory $subcategory)
    {
        return response()->json($subcategory->load('category'));
    }

    public function update(Request $request, Subcategory $subcategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subcategories,name,'.$subcategory->id,
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:51200',
        ]);

        $data = [
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'category_id' => $validated['category_id'],
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('subcategories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $subcategory->update($data);

        return response()->json($subcategory->load('category'));
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();

        return response()->json(null, 204);
    }
}
