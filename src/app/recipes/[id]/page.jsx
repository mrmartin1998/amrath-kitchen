'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch recipe');
      const data = await response.json();
      setRecipe(data);
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
          <h1 className="text-2xl font-bold">{recipe.name}</h1>
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