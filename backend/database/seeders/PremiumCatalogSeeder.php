<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class PremiumCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $categoriesData = [
            'english-willow-bats' => ['name' => 'English Willow Bats', 'img' => 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'],
            'kashmir-willow-bats' => ['name' => 'Kashmir Willow Bats', 'img' => 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'],
            'junior-bats' => ['name' => 'Junior Bats', 'img' => 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=800'],
            'training-bats' => ['name' => 'Training Bats', 'img' => 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'],
            'batting-gloves' => ['name' => 'Batting Gloves', 'img' => 'https://images.unsplash.com/photo-1593787406536-3676a152d9bc?auto=format&fit=crop&q=80&w=800'],
            'helmets' => ['name' => 'Helmets', 'img' => 'https://images.unsplash.com/photo-1589801258579-18e091f4ca26?auto=format&fit=crop&q=80&w=800'],
            'pads' => ['name' => 'Batting Pads', 'img' => 'https://images.unsplash.com/photo-1593787406536-3676a152d9bc?auto=format&fit=crop&q=80&w=800'],
            'balls' => ['name' => 'Cricket Balls', 'img' => 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'],
            'kit-bags' => ['name' => 'Kit Bags', 'img' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'],
            'accessories' => ['name' => 'Accessories', 'img' => 'https://images.unsplash.com/photo-1593787406536-3676a152d9bc?auto=format&fit=crop&q=80&w=800'],
        ];

        $categories = [];
        foreach ($categoriesData as $slug => $data) {
            $categories[$slug] = Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $data['name'], 'image' => $data['img'], 'status' => true]
            );
        }

        $brands = ["SG", "SS", "MRF", "CEAT", "Spartan", "Kookaburra", "Gray-Nicolls", "DSC", "GM", "New Balance", "Masuri", "Shrey"];
        $series = ["Master", "Genius", "Players", "Classic", "Pro", "Elite", "Supreme", "Gladiator", "Nexus", "Hyper", "Pace", "Ton", "Ultimate", "Icon"];
        $models = ["Edition", "Reserve", "Air", "Light", "Drive", "Power", "Strike", "Blaster", "Limited", "Original", "Performance", "Signature"];
        
        $productsToInsert = [];

        for ($i = 0; $i < 320; $i++) {
            $catSlug = array_rand($categoriesData);
            $catId = $categories[$catSlug]->id;
            
            $brand = $brands[array_rand($brands)];
            $serie = $series[array_rand($series)];
            $model = $models[array_rand($models)];
            
            $name = trim("$brand $serie $model " . $categoriesData[$catSlug]['name']);
            $slug = Str::slug($name) . '-' . rand(1000, 9999);
            
            $price = match($catSlug) {
                'english-willow-bats' => rand(15000, 75000),
                'kashmir-willow-bats' => rand(2500, 8000),
                'junior-bats' => rand(1500, 5000),
                'training-bats' => rand(1000, 3000),
                'batting-gloves' => rand(1200, 5000),
                'helmets' => rand(2000, 15000),
                'pads' => rand(2500, 8000),
                'balls' => rand(500, 2500),
                'kit-bags' => rand(3000, 12000),
                'accessories' => rand(200, 1500),
                default => rand(1000, 5000),
            };

            $isSale = rand(0, 1) == 1;
            $originalPrice = $isSale ? $price + rand(500, 3000) : null;

            $descriptionHtml = "
                <h3>Premium Features</h3>
                <p>Designed for professional performance and durability. Tested by international players.</p>
                <ul>
                    <li>High quality material construction</li>
                    <li>Ergonomic design for maximum comfort</li>
                    <li>Officially approved dimensions</li>
                    <li>Superior impact absorption</li>
                </ul>
                <p><strong>Brand:</strong> {$brand}</p>
                <p><strong>Series:</strong> {$serie}</p>
            ";

            $productsToInsert[] = [
                'name' => $name,
                'slug' => $slug,
                'category_id' => $catId,
                'price' => $price,
                'original_price' => $originalPrice,
                'is_sale' => $isSale,
                'stock' => rand(5, 100),
                'description' => $descriptionHtml,
                'image' => $categoriesData[$catSlug]['img'],
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($productsToInsert) >= 100) {
                Product::insert($productsToInsert);
                $productsToInsert = [];
            }
        }

        if (count($productsToInsert) > 0) {
            Product::insert($productsToInsert);
        }
    }
}
