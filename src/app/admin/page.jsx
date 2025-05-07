'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Sample recipe data (same as in other pages)
const sampleRecipes = [
  {
    _id: '1',
    name: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh basil, mozzarella, and tomato sauce. Made with hand-tossed dough and baked in a wood-fired oven.',
    preparationTime: 45,
    portionSize: '2 servings',
    category: 'Italian'
  },
  {
    _id: '2',
    name: 'Chicken Teriyaki Bowl',
    description: 'Tender chicken pieces glazed with homemade teriyaki sauce, served over steamed rice with vegetables.',
    preparationTime: 30,
    portionSize: '4 servings',
    category: 'Japanese'
  },
  {
    _id: '3',
    name: 'Fresh Garden Salad',
    description: 'Crisp mixed greens with seasonal vegetables and a light vinaigrette dressing. Perfect as a side dish or light meal.',
    preparationTime: 15,
    portionSize: '3 servings',
    category: 'Salads'
  }
];

export default function AdminPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete recipe');

      // Remove the recipe from the local state
      setRecipes(recipes.filter(recipe => recipe._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(recipes.map(recipe => recipe.category))];

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-2 sm:px-4">
          <div className="flex-1">
            <Link href="/recipes" className="btn btn-ghost btn-sm">
              ← Recipes
            </Link>
            <h1 className="text-xl font-bold ml-2 sm:ml-4">Recipe Management</h1>
          </div>
          <div className="flex-none">
            <Link href="/admin/new" className="btn btn-primary btn-sm w-full sm:w-auto">
              Add Recipe
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
      <div className="p-2 sm:p-4">
        <div className="grid gap-2 sm:gap-4">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="card bg-base-200 shadow-sm w-full">
              <div className="card-body p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 w-full">
                  <div className="flex-1 w-full">
                    <h2 className="card-title text-lg">{recipe.name}</h2>
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
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Link 
                      href={`/recipes/${recipe._id}`}
                      className="btn btn-sm btn-ghost w-full sm:w-auto"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/admin/edit/${recipe._id}`}
                      className="btn btn-sm btn-ghost w-full sm:w-auto"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(recipe._id)}
                      className="btn btn-sm btn-error w-full sm:w-auto"
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

          {filteredRecipes.length === 0 && (
            <div className="text-center py-8 text-base-content/60">
              {searchTerm || selectedCategory ? 'No recipes match your search' : 'No recipes found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 