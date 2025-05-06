'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
