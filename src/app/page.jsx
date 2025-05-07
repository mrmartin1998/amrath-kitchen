'use client';

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">Amrath Kitchen</h1>
            <p className="py-6 text-base-content/70">
              Your digital recipe management system. Access professional recipes, cooking instructions, and kitchen knowledge at your fingertips.
            </p>
            <Link href="/recipes" className="btn btn-primary w-full sm:w-auto">
              View Recipes
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 px-2 sm:py-12 sm:px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recipe Collection */}
            <div className="card bg-base-200 w-full">
              <div className="card-body">
                <h3 className="card-title">
                  <span className="text-2xl">📚</span>
                  Recipe Collection
                </h3>
                <p className="text-base-content/70">
                  Access a growing collection of professional recipes with detailed instructions and ingredients.
                </p>
              </div>
            </div>
            {/* Easy Search */}
            <div className="card bg-base-200 w-full">
              <div className="card-body">
                <h3 className="card-title">
                  <span className="text-2xl">🔍</span>
                  Easy Search
                </h3>
                <p className="text-base-content/70">
                  Find recipes quickly with powerful search and category filters.
                </p>
              </div>
            </div>
            {/* Detailed Instructions */}
            <div className="card bg-base-200 w-full">
            <div className="card-body">
                <h3 className="card-title">
                  <span className="text-2xl">📝</span>
                  Detailed Instructions
                </h3>
                <p className="text-base-content/70">
                  Step-by-step cooking instructions with measurements and timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-8 px-2 sm:py-12 sm:px-4 bg-base-200">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Browse Recipes */}
            <Link href="/recipes" className="card bg-base-100 hover:shadow-lg transition-shadow w-full">
              <div className="card-body items-center text-center">
                <h3 className="card-title">
                  <span className="text-3xl">🍳</span>
                </h3>
                <p className="font-semibold">Browse Recipes</p>
                <p className="text-sm text-base-content/70">
                  Explore our collection of recipes
                </p>
              </div>
            </Link>
            {/* Admin Panel */}
            <Link href="/admin" className="card bg-base-100 hover:shadow-lg transition-shadow w-full">
              <div className="card-body items-center text-center">
                <h3 className="card-title">
                  <span className="text-3xl">⚙️</span>
                </h3>
                <p className="font-semibold">Recipe Management</p>
                <p className="text-sm text-base-content/70">
                  Add and manage recipes
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="py-8 px-2 sm:py-12 sm:px-4">
        <div className="container mx-auto text-center">
          <div className="alert bg-base-200 max-w-2xl mx-auto">
            <span className="text-base-content/70">
              📸 Coming Soon: Photo uploads and video integration for recipes!
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
