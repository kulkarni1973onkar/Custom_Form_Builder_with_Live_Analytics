export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1),transparent_50%)] bg-[radial-gradient(circle_at_40%_60%,rgba(120,219,226,0.1),transparent_50%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 font-sans">
        <main className="flex flex-col items-center text-center max-w-4xl gap-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
              <span className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Now with real-time analytics
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
              Build Forms That
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Convert
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Create sophisticated forms with conditional logic, real-time analytics, and seamless user experiences.
              No code required — just drag, drop, and deploy.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href="/forms/new"
              className="group inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-50 hover:scale-105 hover:shadow-2xl hover:shadow-white/25 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Start Building
              <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/50 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
            >
              Learn More
            </a>
          </div>

          {/* Features Preview */}
          <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <div className="group rounded-2xl border border-slate-700 bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-200 hover:bg-slate-800/50 hover:border-slate-600">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Form Logic</h3>
              <p className="text-slate-400">Conditional fields, validation rules, and dynamic behavior that adapts to user input.</p>
            </div>

            <div className="group rounded-2xl border border-slate-700 bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-200 hover:bg-slate-800/50 hover:border-slate-600">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
              <p className="text-slate-400">Track responses, completion rates, and user behavior with live dashboards and insights.</p>
            </div>

            <div className="group rounded-2xl border border-slate-700 bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-200 hover:bg-slate-800/50 hover:border-slate-600">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Integration</h3>
              <p className="text-slate-400">Embed forms anywhere with customizable styling and seamless API integration.</p>
            </div>
          </div>
        </main>

        <footer className="absolute bottom-8 text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Custom Form Builder. Built for modern teams.
        </footer>
      </div>
    </div>
  );
}
