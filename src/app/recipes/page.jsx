'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Sample recipe data
const sampleRecipes = [
  {
    _id: '1',
    name: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh basil, mozzarella, and tomato sauce. Made with hand-tossed dough and baked in a wood-fired oven.',
    preparationTime: 45,
    portionSize: '2 servings',
    category: 'Italian',
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
    _id: '2',
    name: 'Chicken Teriyaki Bowl',
    description: 'Tender chicken pieces glazed with homemade teriyaki sauce, served over steamed rice with vegetables.',
    preparationTime: 30,
    portionSize: '4 servings',
    category: 'Japanese',
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
    _id: '3',
    name: 'Fresh Garden Salad',
    description: 'Crisp mixed greens with seasonal vegetables and a light vinaigrette dressing. Perfect as a side dish or light meal.',
    preparationTime: 15,
    portionSize: '3 servings',
    category: 'Salads',
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

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API fetch with sample data
    setTimeout(() => {
      setRecipes(sampleRecipes);
      setLoading(false);
    }, 1000); // Add a small delay to see loading state
  }, []);

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

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold">Recipes</h1>
          </div>
          <div className="flex-none">
            <Link href="/admin" className="btn btn-primary btn-sm">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Recipe List */}
      <div className="p-4 space-y-4">
        {recipes.map((recipe) => (
          <Link 
            href={`/recipes/${recipe._id}`} 
            key={recipe._id}
            className="block"
          >
            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body p-4">
                <h2 className="card-title text-lg">{recipe.name}</h2>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                  <span>⏱️ {recipe.preparationTime} mins</span>
                  <span>•</span>
                  <span>👥 {recipe.portionSize}</span>
                  <span>•</span>
                  <span>🏷️ {recipe.category}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {recipes.length === 0 && (
          <div className="text-center py-8 text-base-content/60">
            No recipes found
          </div>
        )}
      </div>
    </div>
  );
}
