'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: [''],
    photos: [],
    videoUrl: '',
    portionSize: '',
    preparationTime: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
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

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
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
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create recipe');

      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-4">
          <div className="flex-1">
            <Link href="/admin" className="btn btn-ghost btn-sm">
              ← Back
            </Link>
            <h1 className="text-xl font-bold ml-4">New Recipe</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Preparation Time (mins)</span>
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                className="input input-bordered"
                required
                min="0"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Portion Size</span>
              </label>
              <input
                type="text"
                name="portionSize"
                value={formData.portionSize}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
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
            <div key={index} className="flex gap-2 items-start">
              <div className="form-control flex-1">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  placeholder="Ingredient name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control w-24">
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control w-24">
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                  placeholder="Unit"
                  className="input input-bordered"
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
            <div key={index} className="flex gap-2">
              <span className="font-bold text-primary mt-2">{index + 1}.</span>
              <div className="form-control flex-1">
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  className="textarea textarea-bordered"
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

        {/* Media */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Media</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Video URL (optional)</span>
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="https://..."
            />
          </div>

          {/* Photo upload will be implemented later */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Photos (coming soon)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              disabled
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/admin" className="btn btn-ghost">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Create Recipe'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 