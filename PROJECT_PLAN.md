# Amrath Kitchen - Recipe Management System

## Project Overview
A digital recipe management system for restaurant kitchen staff to view recipes with photos, videos, steps, and ingredients. Chefs can add and manage recipes for the kitchen team to access.

## Core Features (Version 1)

### 1. Recipe Management
- Create/Edit/Delete recipes
- Recipe details:
  - Name
  - Description
  - Ingredients list
  - Step-by-step instructions
  - Photos
  - Video links (optional)
  - Portion size
  - Preparation time

### 2. User Roles
- Chef (Admin)
  - Full CRUD access to recipes
  - Can manage other users
- Kitchen Staff (Viewer)
  - Can view recipes
  - Can search/filter recipes

### 3. Basic Features
- Recipe search
- Recipe categories/filters
- Responsive design (for mobile/tablet use in kitchen)

## Database Schema (MongoDB)

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  role: String, // 'chef' or 'staff'
  password: String,
  createdAt: Date
}
```

### Recipe Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  instructions: [String],
  photos: [String], // URLs to images
  videoUrl: String, // Optional
  portionSize: String,
  preparationTime: Number, // in minutes
  category: String,
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints (Next.js API Routes)

### Recipes API
```
/api/recipes
  - GET / - List all recipes
  - POST / - Create new recipe
  - GET /[id] - Get single recipe
  - PUT /[id] - Update recipe
  - DELETE /[id] - Delete recipe
```

### Users API
```
/api/users
  - POST /register - Register new user
  - POST /login - User login
  - GET /profile - Get user profile
```

## Frontend Structure
```
src/
  ├── app/
  │   ├── (auth)/
  │   │   ├── login/
  │   │   └── register/
  │   ├── recipes/
  │   │   ├── [id]/
  │   │   └── new/
  │   └── dashboard/
  ├── components/
  │   ├── RecipeCard.js
  │   ├── RecipeForm.js
  │   ├── Navbar.js
  │   └── SearchBar.js
  └── lib/
      ├── auth.js
      └── mongodb.js
```

## Security Considerations
1. Authentication system
2. Role-based access control
3. Image upload security
4. API route protection

## Tech Stack
- Frontend:
  - React.js
  - Next.js
  - Tailwind CSS
  - DaisyUI
- Backend:
  - Next.js API Routes
  - MongoDB
  - Mongoose

## Deployment
- Platform: Vercel
- Database: MongoDB Atlas 