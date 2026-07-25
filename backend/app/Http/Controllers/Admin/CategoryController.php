<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255|unique:categories',
            'status' => 'nullable',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120';
        } elseif ($request->filled('image')) {
            $rules['image'] = 'string|url';
        }

        $request->validate($rules);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/'.$request->file('image')->store('categories', 'public');
        } elseif ($request->filled('image') && is_string($request->image)) {
            $imagePath = trim($request->image);
        }

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'image' => $imagePath,
            'status' => $request->boolean('status', true),
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $rules = [
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
            'status' => 'nullable',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120';
        } elseif ($request->filled('image')) {
            $rules['image'] = 'string';
        }

        $request->validate($rules);

        $imagePath = $category->image;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/'.$request->file('image')->store('categories', 'public');
        } elseif ($request->filled('image') && is_string($request->image)) {
            $imagePath = trim($request->image);
        }

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'image' => $imagePath,
            'status' => $request->boolean('status', true),
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
