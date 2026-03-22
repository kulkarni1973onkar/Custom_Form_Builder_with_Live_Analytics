export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center p-8 font-sans">
      <main className="flex flex-col items-center text-center max-w-2xl gap-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
          Custom Form Builder
        </h1>
        <p className="text-lg text-neutral-400 max-w-xl">
          Create, manage, and share complex forms with conditional logic and real-time analytics. Build your next form in seconds.
        </p>
        
        <div className="flex sm:flex-row flex-col gap-4 mt-8">
          <a
            href="/forms/new"
            className="flex items-center justify-center rounded-full bg-white text-black px-8 py-3 font-semibold transition-transform hover:scale-105"
          >
            Create New Form
          </a>
          <a
            href="/forms/new"
            className="flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Get Started
          </a>
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Custom Form Builder. All rights reserved.
      </footer>
    </div>
  );
}
