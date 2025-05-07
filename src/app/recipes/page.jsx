'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Sample recipe data
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

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch recipes from API
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const apiRecipes = await response.json();
        
        // Combine API recipes with sample recipes
        setRecipes([...apiRecipes, ...sampleRecipes]);
      } catch (err) {
        setError(err.message);
        // If API fails, at least show sample recipes
        setRecipes(sampleRecipes);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from all recipes
  const categories = [...new Set(recipes.map(recipe => recipe.category))];

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
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-2 sm:px-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold">Recipes</h1>
          </div>
          <div className="flex-none">
            <Link href="/admin" className="btn btn-primary btn-sm w-full sm:w-auto">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-2 sm:p-4 bg-base-200">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recipes..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              className="select select-bordered w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recipe List */}
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        {filteredRecipes.map((recipe) => (
          <Link 
            href={`/recipes/${recipe._id}`} 
            key={recipe._id}
            className="block w-full"
          >
            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow w-full">
              <div className="card-body p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                  <h2 className="card-title text-lg">{recipe.name}</h2>
                  {recipe.isSample && (
                    <span className="badge badge-ghost">Sample</span>
                  )}
                </div>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-base-content/60">
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

        {filteredRecipes.length === 0 && (
          <div className="text-center py-8 text-base-content/60">
            {searchTerm || selectedCategory ? 'No recipes match your search' : 'No recipes found'}
          </div>
        )}
      </div>
    </div>
  );
}
