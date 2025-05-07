import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/lib/models/Recipe';

// GET /api/recipes - Get all recipes
export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find({})
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version key

    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request) {
  try {
    await connectDB();
    
    // Get the form data
    const formData = await request.formData();
    
    // Parse the recipe data from JSON string
    const recipeDataStr = formData.get('recipe');
    if (!recipeDataStr) {
      return NextResponse.json(
        { error: 'Recipe data is required' },
        { status: 400 }
      );
    }
    
    const recipeData = JSON.parse(recipeDataStr);
    
    // Basic validation
    if (!recipeData.name || !recipeData.description || !recipeData.ingredients || !recipeData.instructions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle photo uploads
    const photoUrls = [];
    const photos = formData.getAll('photos');
    
    // Process each photo
    for (const photo of photos) {
      try {
        // Get the binary data
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert to base64 and create data URL
        const base64 = buffer.toString('base64');
        const mimeType = photo.type || 'image/jpeg'; // Default to jpeg if type is not available
        photoUrls.push(`data:${mimeType};base64,${base64}`);
      } catch (err) {
        console.error('Error processing photo:', err);
        // Continue with other photos if one fails
        continue;
      }
    }
    
    // Add photo URLs to recipe data
    recipeData.photos = photoUrls;

    // For now, we'll use a temporary createdBy ID
    // This will be replaced with actual user authentication later
    const tempUserId = '000000000000000000000000';
    recipeData.createdBy = tempUserId;

    const recipe = await Recipe.create(recipeData);
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
} 