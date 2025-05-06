'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Sample recipe data (same as in the list page)
const sampleRecipes = [
  {
    _id: 'sample_1',
    name: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh basil, mozzarella, and tomato sauce. Made with hand-tossed dough and baked in a wood-fired oven.',
    preparationTime: 45,
    portionSize: '2 servings',
    category: 'Italian',
    isSample: true,
    ingredients: [
      { name: 'Pizza Dough', quantity: '250', unit: 'g' },
      { name: 'Mozzarella', quantity: '200', unit: 'g' },
      { name: 'Fresh Basil', quantity: '10', unit: 'leaves' },
      { name: 'Tomato Sauce', quantity: '100', unit: 'ml' }
    ],
    instructions: [
      'Preheat oven to 450°F (230°C)',
      'Roll out the pizza dough',
      'Spread tomato sauce evenly',
      'Add torn mozzarella pieces',
      'Bake for 15-20 minutes',
      'Add fresh basil leaves'
    ]
  },
  {
    _id: 'sample_2',
    name: 'Chicken Teriyaki Bowl',
    description: 'Tender chicken pieces glazed with homemade teriyaki sauce, served over steamed rice with vegetables.',
    preparationTime: 30,
    portionSize: '4 servings',
    category: 'Japanese',
    isSample: true,
    ingredients: [
      { name: 'Chicken Thighs', quantity: '500', unit: 'g' },
      { name: 'Soy Sauce', quantity: '60', unit: 'ml' },
      { name: 'Mirin', quantity: '60', unit: 'ml' },
      { name: 'Steamed Rice', quantity: '2', unit: 'cups' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Mix soy sauce and mirin',
      'Cook chicken until golden',
      'Add sauce and simmer',
      'Serve over steamed rice'
    ]
  },
  {
    _id: 'sample_3',
    name: 'Fresh Garden Salad',
    description: 'Crisp mixed greens with seasonal vegetables and a light vinaigrette dressing. Perfect as a side dish or light meal.',
    preparationTime: 15,
    portionSize: '3 servings',
    category: 'Salads',
    isSample: true,
    ingredients: [
      { name: 'Mixed Greens', quantity: '200', unit: 'g' },
      { name: 'Cherry Tomatoes', quantity: '100', unit: 'g' },
      { name: 'Cucumber', quantity: '1', unit: 'whole' },
      { name: 'Olive Oil', quantity: '30', unit: 'ml' }
    ],
    instructions: [
      'Wash and dry all vegetables',
      'Cut tomatoes in half',
      'Slice cucumber thinly',
      'Mix vinaigrette',
      'Toss all ingredients together'
    ]
  }
];

export default function RecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Check if it's a sample recipe first
        const sampleRecipe = sampleRecipes.find(r => r._id === params.id);
        if (sampleRecipe) {
          setRecipe(sampleRecipe);
          setLoading(false);
          return;
        }

        // If not a sample recipe, fetch from API
        const response = await fetch(`/api/recipes/${params.id}`);
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        const apiRecipe = await response.json();
        setRecipe(apiRecipe);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="alert alert-warning">
          <span>Recipe not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-4">
          <div className="flex-1">
            <Link href="/recipes" className="btn btn-ghost btn-sm">
              ← Back
            </Link>
          </div>
          <div className="flex-none">
            <Link href="/admin" className="btn btn-primary btn-sm">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-4 space-y-6">
        {/* Recipe Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{recipe.name}</h1>
            {recipe.isSample && (
              <span className="badge badge-ghost">Sample</span>
            )}
          </div>
          <p className="text-base-content/70">{recipe.description}</p>
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <span>⏱️ {recipe.preparationTime} mins</span>
            <span>👥 {recipe.portionSize}</span>
            <span>🏷️ {recipe.category}</span>
          </div>
        </div>

        {/* Photos */}
        {recipe.photos && recipe.photos.length > 0 && (
          <div className="carousel carousel-center max-w-full p-4 space-x-4 bg-base-200 rounded-box">
            {recipe.photos.map((photo, index) => (
              <div key={index} className="carousel-item">
                <img
                  src={photo}
                  alt={`${recipe.name} - Photo ${index + 1}`}
                  className="rounded-box h-48 w-48 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Video */}
        {recipe.videoUrl && (
          <div className="aspect-video w-full">
            <iframe
              src={recipe.videoUrl}
              className="w-full h-full rounded-box"
              allowFullScreen
            />
          </div>
        )}

        {/* Ingredients */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-24 text-base-content/70">
                  {ingredient.quantity} {ingredient.unit}
                </span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="font-bold text-primary">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
} 