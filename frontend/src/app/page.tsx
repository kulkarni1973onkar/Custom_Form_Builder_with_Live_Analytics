import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, BarChart3, Shield, Users } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import Card from '@/components/UI/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1),transparent_50%)] bg-[radial-gradient(circle_at_40%_60%,rgba(120,219,226,0.1),transparent_50%)]" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen p-8 font-sans">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm animate-fade-in">
              <div className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              Now with real-time analytics & AI insights
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-fade-in-up">
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
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up animation-delay-200">
              <Button asChild size="lg" className="group bg-white text-slate-900 hover:bg-slate-50 shadow-2xl shadow-white/25">
                <Link href="/forms/new">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-slate-600 text-white hover:bg-slate-800/50 backdrop-blur-sm">
                <a href="#features">Explore Features</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-slate-400 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything you need to create
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> better forms</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful features that help you build forms that convert, analyze responses, and grow your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group p-6 border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Form Logic</h3>
                <p className="text-slate-400">Conditional fields, validation rules, and dynamic behavior that adapts to user input in real-time.</p>
              </Card>

              <Card className="group p-6 border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
                <p className="text-slate-400">Track responses, completion rates, and user behavior with live dashboards and AI-powered insights.</p>
              </Card>

              <Card className="group p-6 border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-slate-400">Bank-level encryption, GDPR compliance, and advanced security features to protect your data.</p>
              </Card>

              <Card className="group p-6 border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
                <p className="text-slate-400">Work together with your team, share forms, and manage permissions with role-based access control.</p>
              </Card>

              <Card className="group p-6 border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Easy Integration</h3>
                <p className="text-slate-400">Embed forms anywhere with customizable styling, webhooks, and seamless API integration.</p>
              </Card>

              <Card className="group p-6 border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Insights</h3>
                <p className="text-slate-400">Get intelligent recommendations and automated analysis to improve your form performance.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to build your next form?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join thousands of teams who trust our platform to create forms that convert.
            </p>
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-50">
              <Link href="/forms/new">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-12 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">Form Builder</span>
              </div>

              <div className="flex space-x-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <a href="#" className="hover:text-white transition-colors">Docs</a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Custom Form Builder. Built for modern teams.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
