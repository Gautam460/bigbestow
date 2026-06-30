<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $cats = [
            [
                'name' => 'English Willow Bats',
                'slug' => 'english-willow-bats',
                'image' => '/images/bats.jpg',
                'status' => true,
            ],
            [
                'name' => 'Kashmir Willow Bats',
                'slug' => 'kashmir-willow-bats',
                'image' => '/images/kashmir.jpg',
                'status' => true,
            ],
            [
                'name' => 'Protective Gear',
                'slug' => 'protective-gear',
                'image' => '/images/gloves.jpg',
                'status' => true,
            ],
            [
                'name' => 'Cricket Helmets',
                'slug' => 'cricket-helmets',
                'image' => '/images/helmets.jpg',
                'status' => true,
            ],
            [
                'name' => 'Kit Bags & Accessories',
                'slug' => 'kit-bags',
                'image' => '/images/bags.jpg',
                'status' => true,
            ],
        ];

        $createdCategories = [];
        foreach ($cats as $cat) {
            $createdCategories[$cat['slug']] = Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        $products = [
            [
                'name' => 'SS Master 9900 English Willow Cricket Bat',
                'category_id' => $createdCategories['english-willow-bats']->id,
                'price' => 349.99,
                'stock' => 25,
                'description' => 'Handcrafted from Grade 1 English Willow with massive edges and sweet spot designed for powerful hitters.',
                'image' => 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'MRF Genius Grand Edition Cricket Bat',
                'category_id' => $createdCategories['english-willow-bats']->id,
                'price' => 399.00,
                'stock' => 15,
                'description' => 'Endorsed by international champions. Premium balance, feather-light pickup, and exceptional stroke play.',
                'image' => 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'SG Scorer Classic Kashmir Willow Bat',
                'category_id' => $createdCategories['kashmir-willow-bats']->id,
                'price' => 89.50,
                'stock' => 60,
                'description' => 'Traditional shape and heavy profile for club cricket and tennis/leather ball practice.',
                'image' => 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'DSC Intense Pro Kashmir Willow Bat',
                'category_id' => $createdCategories['kashmir-willow-bats']->id,
                'price' => 99.99,
                'stock' => 45,
                'description' => 'Exquisite balance and thick edges engineered for hard tennis and leather ball cricket.',
                'image' => 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'SS Test Opener Batting Gloves',
                'category_id' => $createdCategories['protective-gear']->id,
                'price' => 59.99,
                'stock' => 80,
                'description' => 'Sheep leather palm with multi-flex sausage fingers providing extreme protection and comfort.',
                'image' => 'https://images.unsplash.com/photo-1593787406536-3676a152d9bc?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'SG Test White Batting Leg Guards (Pads)',
                'category_id' => $createdCategories['protective-gear']->id,
                'price' => 79.99,
                'stock' => 40,
                'description' => 'High density foam construction with traditional cane reinforcement for international level safety.',
                'image' => 'https://images.unsplash.com/photo-1593787406536-3676a152d9bc?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'Masuri E-Line Titanium Cricket Helmet',
                'category_id' => $createdCategories['cricket-helmets']->id,
                'price' => 189.00,
                'stock' => 20,
                'description' => 'Ultimate head protection featuring patented eye-line grille and advanced impact foam inside.',
                'image' => 'https://images.unsplash.com/photo-1589801258579-18e091f4ca26?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'Shrey Master Class Air Grille Helmet',
                'category_id' => $createdCategories['cricket-helmets']->id,
                'price' => 129.99,
                'stock' => 30,
                'description' => 'Ultralight weight ventilated shell with titanium visor for unmatched clarity and safety.',
                'image' => 'https://images.unsplash.com/photo-1589801258579-18e091f4ca26?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'SS Gladiator Pro Wheelie Kit Bag',
                'category_id' => $createdCategories['kit-bags']->id,
                'price' => 149.99,
                'stock' => 35,
                'description' => 'Massive storage space with heavy duty tractor wheels, individual bat compartments, and shoe tunnel.',
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'name' => 'MRF Player Edition Duffle Bag',
                'category_id' => $createdCategories['kit-bags']->id,
                'price' => 109.99,
                'stock' => 50,
                'description' => 'Standup duffle design with padded shoulder straps and 3 dedicated external bat sleeves.',
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
            ],
        ];

        foreach ($products as $p) {
            $slug = Str::slug($p['name']);
            Product::firstOrCreate(['slug' => $slug], array_merge($p, [
                'slug' => $slug,
                'status' => true
            ]));
        }
    }
}
