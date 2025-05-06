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
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.description || !body.ingredients || !body.instructions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, we'll use a temporary createdBy ID
    // This will be replaced with actual user authentication later
    const tempUserId = '000000000000000000000000';
    body.createdBy = tempUserId;

    const recipe = await Recipe.create(body);
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
} 