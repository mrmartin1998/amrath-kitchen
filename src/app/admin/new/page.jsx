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

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadError, setUploadError] = useState(null);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setUploadError('Maximum 5 images allowed');
      return;
    }
    setUploadError(null);
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadError(null);

    try {
      // Create FormData for multipart form submission
      const formDataToSend = new FormData();
      
      // Append recipe data as JSON
      const recipeData = { ...formData };
      delete recipeData.photos; // Remove photos array as we'll handle it separately
      formDataToSend.append('recipe', JSON.stringify(recipeData));
      
      // Append each selected image
      selectedImages.forEach((file, index) => {
        formDataToSend.append('photos', file);
      });

      const response = await fetch('/api/recipes', {
        method: 'POST',
        body: formDataToSend, // Send as FormData
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
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="navbar px-2 sm:px-4">
          <div className="flex-1">
            <Link href="/admin" className="btn btn-ghost btn-sm">
              ← Back
            </Link>
            <h1 className="text-xl font-bold ml-2 sm:ml-4">New Recipe</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-4 space-y-8 max-w-xl mx-auto w-full">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="form-control w-full">
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

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24 w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Preparation Time (mins)</span>
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                min="0"
              />
            </div>

            <div className="form-control w-full">
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
          </div>

          <div className="form-control w-full">
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

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h2 className="text-lg font-semibold">Ingredients</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="btn btn-primary btn-sm w-full sm:w-auto"
            >
              Add Ingredient
            </button>
          </div>

          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch w-full">
              <div className="form-control flex-1">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  placeholder="Ingredient name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full sm:w-24">
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full sm:w-24">
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
                className="btn btn-ghost btn-sm w-full sm:w-auto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h2 className="text-lg font-semibold">Instructions</h2>
            <button
              type="button"
              onClick={addInstruction}
              className="btn btn-primary btn-sm w-full sm:w-auto"
            >
              Add Step
            </button>
          </div>

          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 items-start w-full">
              <span className="font-bold text-primary mt-2">{index + 1}.</span>
              <div className="form-control flex-1">
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="btn btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Media */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Media</h2>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Video URL (optional)</span>
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="https://..."
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Photos (optional, max 5)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            {uploadError && (
              <label className="label">
                <span className="label-text-alt text-error">{uploadError}</span>
              </label>
            )}
            {selectedImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImages(selectedImages.filter((_, i) => i !== index));
                      }}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 w-full">
          <Link href="/admin" className="btn btn-ghost w-full sm:w-auto">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
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