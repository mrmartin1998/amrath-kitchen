import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/lib/models/Recipe';

// GET /api/recipes/[id] - Get a single recipe
export async function GET(request, { params }) {
  try {
    await connectDB();
    const recipe = await Recipe.findById(params.id).select('-__v');

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(request, { params }) {
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

    const recipe = await Recipe.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const recipe = await Recipe.findByIdAndDelete(params.id);

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Recipe deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
} 