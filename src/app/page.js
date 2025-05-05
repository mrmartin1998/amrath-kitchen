import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Amrath Kitchen</h1>
        
        {/* DaisyUI Components Test */}
        <div className="grid gap-4">
          {/* Button Test */}
          <div className="flex gap-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-accent">Accent Button</button>
          </div>

          {/* Card Test */}
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recipe Card Example</h2>
              <p>This is a test card using DaisyUI components.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Recipe</button>
              </div>
            </div>
          </div>

          {/* Alert Test */}
          <div className="alert alert-info">
            <span>This is an info alert using DaisyUI</span>
          </div>
        </div>
      </div>
    </main>
  );
}
