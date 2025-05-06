'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete recipe');
      
      setRecipes(recipes.filter(recipe => recipe._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
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
            <Link href="/recipes" className="btn btn-ghost btn-sm">
              ← Recipes
            </Link>
            <h1 className="text-xl font-bold ml-4">Admin</h1>
          </div>
          <div className="flex-none">
            <Link href="/admin/new" className="btn btn-primary btn-sm">
              New Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Recipe List */}
      <div className="p-4 space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div>
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
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link 
                    href={`/admin/edit/${recipe._id}`}
                    className="btn btn-sm btn-ghost"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(recipe._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === recipe._id && (
                <div className="mt-4 p-4 bg-base-300 rounded-box">
                  <p className="text-sm mb-2">Are you sure you want to delete this recipe?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="btn btn-sm btn-error"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="btn btn-sm btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {recipes.length === 0 && (
          <div className="text-center py-8 text-base-content/60">
            No recipes found. Create your first recipe!
          </div>
        )}
      </div>
    </div>
  );
} 