import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true
  },
  ingredients: [{
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    }
  }],
  instructions: [{
    type: String,
    required: [true, 'Instructions are required'],
    trim: true
  }],
  photos: [{
    type: String,
    trim: true
  }],
  videoUrl: {
    type: String,
    trim: true
  },
  portionSize: {
    type: String,
    required: [true, 'Portion size is required'],
    trim: true
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [0, 'Preparation time cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes for better query performance
recipeSchema.index({ name: 'text', description: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ createdBy: 1 });

// Create the model
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

export default Recipe; 