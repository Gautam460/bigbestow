<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with(['category', 'subcategory'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'images.*' => 'image|max:5120', // Validate each image up to 5MB
        ]);

        $gallery = $request->input('existing_images', []);
        if (!is_array($gallery)) $gallery = [];
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if ($file->isValid()) {
                    $gallery[] = '/storage/' . $file->store('products', 'public');
                }
            }
        }
            
        $imagePath = count($gallery) > 0 ? $gallery[0] : 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800';

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']).'-'.uniqid(),
            'category_id' => $validated['category_id'],
            'subcategory_id' => !empty($validated['subcategory_id']) ? $validated['subcategory_id'] : null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'description' => $validated['description'] ?? '',
            'image' => $imagePath,
            'gallery' => $gallery,
        ]);

        return response()->json($product->load(['category', 'subcategory']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'subcategory']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'images.*' => 'image|max:5120', // Validate each image up to 5MB
        ]);

        $gallery = $request->input('existing_images', []);
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if ($file->isValid()) {
                    $gallery[] = '/storage/' . $file->store('products', 'public');
                }
            }
        }
        
        $imagePath = count($gallery) > 0 ? $gallery[0] : 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800';

        $product->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'subcategory_id' => !empty($validated['subcategory_id']) ? $validated['subcategory_id'] : null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'description' => $validated['description'] ?? '',
            'image' => $imagePath,
            'gallery' => $gallery,
        ]);

        return response()->json($product->load(['category', 'subcategory']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
