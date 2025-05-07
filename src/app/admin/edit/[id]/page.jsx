'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditRecipePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    preparationTime: '',
    portionSize: '',
    category: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: ['']
  });

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch recipe');
        const recipe = await response.json();
        
        // Format data for form
        setFormData({
          name: recipe.name || '',
          description: recipe.description || '',
          preparationTime: recipe.preparationTime || '',
          portionSize: recipe.portionSize || '',
          category: recipe.category || '',
          ingredients: recipe.ingredients?.length ? recipe.ingredients : [{ name: '', quantity: '', unit: '' }],
          instructions: recipe.instructions?.length ? recipe.instructions : ['']
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value
      };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleInstructionChange = (index, value) => {
    setFormData(prev => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = value;
      return { ...prev, instructions: newInstructions };
    });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update recipe');
      
      // Redirect to admin page on success
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-4">
          <div className="flex-1">
            <Link href="/admin" className="btn btn-ghost btn-sm">
              ← Back
            </Link>
            <h1 className="text-xl font-bold ml-4">Edit Recipe</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Recipe Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Prep Time (mins)</span>
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Portion Size</span>
                </label>
                <input
                  type="text"
                  name="portionSize"
                  value={formData.portionSize}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="btn btn-sm btn-primary"
              >
                Add Ingredient
              </button>
            </div>

            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="w-24">
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="w-24">
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    placeholder="Unit"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="btn btn-sm btn-ghost"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Instructions</h2>
              <button
                type="button"
                onClick={addInstruction}
                className="btn btn-sm btn-primary"
              >
                Add Step
              </button>
            </div>

            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <span className="font-bold text-primary">{index + 1}.</span>
                <div className="flex-1">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    className="textarea textarea-bordered w-full"
                    rows="2"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="btn btn-sm btn-ghost"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin" className="btn btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 