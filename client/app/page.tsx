"use client";
import { useEffect, useState } from "react"; // Add these
import api from "@/lib/api"; // Add this
import Link from "next/link";
import { 
  ArrowRight, Heart, Shield, Globe, Users, CheckCircle, 
  Zap, Lock, TrendingUp, Target, Building2, HandHeart,
  DollarSign, Eye, Sparkles, Star
} from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({ 
    raised: 0, 
    donors: 0, 
    ngos: 0, 
    impact: 0 
  });

  useEffect(() => {
    // Fetch real stats from backend
    api.get('/public/stats')
      .then(res => setStats(res.data))
      .catch(err => console.log("Stats fetch failed, using defaults"));
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              NGO Marketplace
            </span>
          </Link>

          {/* NEW: Explore Link */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
             <Link href="/campaigns" className="hover:text-emerald-400 transition-colors">Explore Causes</Link>
             <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-6 py-2 text-slate-300 hover:text-white transition-colors font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/30">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>
      {/* 1. HERO SECTION */}
      <header className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
        
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-800/50 bg-emerald-900/20 backdrop-blur-sm text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Powered by Web3 & AI</span>
          <span className="px-2 py-0.5 bg-emerald-700/30 rounded-full text-xs text-emerald-300">Beta</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
            Transparency Meets
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Compassion
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          India's first blockchain-powered NGO marketplace. Connect with verified organizations, 
          donate with confidence, and track every rupee in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link href="/register">
            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-lg transition-all shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-900/70 hover:scale-105 flex items-center gap-2">
              Start Making Impact
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <Link href="#how-it-works">
            <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm text-white rounded-xl font-bold text-lg transition-all border border-slate-700 hover:border-slate-600 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              See How It Works
            </button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm animate-in fade-in duration-700 delay-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>100% Verified NGOs</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            <span>Blockchain Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>AI-Powered Matching</span>
          </div>
        </div>
      </header>

      {/* 2. STATS SECTION */}
<section className="relative py-20 bg-slate-900/50 backdrop-blur-sm border-y border-slate-800">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <StatCard 
        icon={<DollarSign className="w-8 h-8" />} 
        value={`₹${stats.raised.toLocaleString()}`}  // <--- REAL DATA
        label="Funds Raised"
        color="from-emerald-600 to-emerald-700"
      />
      <StatCard 
        icon={<Users className="w-8 h-8" />} 
        value={`${stats.donors}+`} // <--- REAL DATA
        label="Active Donors"
        color="from-blue-600 to-blue-700"
      />
      <StatCard 
        icon={<Building2 className="w-8 h-8" />} 
        value={`${stats.ngos}+`} // <--- REAL DATA
        label="Verified NGOs"
        color="from-purple-600 to-purple-700"
      />
      <StatCard 
        icon={<Heart className="w-8 h-8" />} 
        value={`${stats.impact}+`} // <--- REAL DATA
        label="Campaigns Launched" // Changed label to match data
        color="from-pink-600 to-pink-700"
      />
    </div>
  </div>
</section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="relative py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Three simple steps to start making a difference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number="01"
            icon={<Users className="w-10 h-10" />}
            title="Choose Your Role"
            description="Register as a Donor, Volunteer, or NGO. Each role is tailored to maximize your impact."
            gradient="from-blue-600 to-blue-700"
          />
          <StepCard
            number="02"
            icon={<Target className="w-10 h-10" />}
            title="Find Your Cause"
            description="Browse verified campaigns or get AI-matched with opportunities that align with your interests."
            gradient="from-purple-600 to-purple-700"
          />
          <StepCard
            number="03"
            icon={<Zap className="w-10 h-10" />}
            title="Track Your Impact"
            description="Every donation is recorded on blockchain. Watch your contribution make real-time changes."
            gradient="from-emerald-600 to-emerald-700"
          />
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="relative py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text */}
            <div>
              <div className="inline-block px-3 py-1 bg-emerald-900/20 border border-emerald-800/30 rounded-full text-emerald-400 text-sm font-semibold mb-6">
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Trust Through <br/>
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Technology
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Traditional donations suffer from opacity. You donate, but never know if your money truly helped.
                <br /><br />
                Our platform uses <strong className="text-white">blockchain smart contracts</strong> to record 
                every transaction. Combined with <strong className="text-white">AI-powered matching</strong>, 
                we ensure your contribution creates maximum impact.
              </p>
              
              <div className="space-y-4 mb-8">
                <FeatureItem icon={<Shield />} text="100% Transparent Transaction History" />
                <FeatureItem icon={<Lock />} text="Blockchain-Verified NGO Credentials" />
                <FeatureItem icon={<Zap />} text="AI-Powered Volunteer Matching" />
                <FeatureItem icon={<TrendingUp />} text="Real-Time Impact Tracking" />
              </div>

              <Link href="/register">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2">
                  Join the Movement
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Right: Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Verified NGOs"
                description="Admin-approved organizations only"
                color="from-emerald-600 to-emerald-700"
              />
              <FeatureCard
                icon={<Lock className="w-8 h-8" />}
                title="Blockchain"
                description="Immutable transaction records"
                color="from-blue-600 to-blue-700"
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="AI Matching"
                description="Smart volunteer-NGO pairing"
                color="from-purple-600 to-purple-700"
              />
              <FeatureCard
                icon={<Eye className="w-8 h-8" />}
                title="Full Transparency"
                description="Track every rupee donated"
                color="from-pink-600 to-pink-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. USER TYPES SECTION */}
      <section className="relative py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Join As
            </span>
          </h2>
          <p className="text-slate-400 text-lg">Choose your path to making a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RoleCard
            icon={<DollarSign className="w-12 h-12" />}
            title="Donor"
            description="Support causes you care about with transparent, blockchain-secured donations"
            features={["Track donations in real-time", "See direct impact", "Tax receipts & reports"]}
            gradient="from-blue-600 to-blue-700"
          />
          <RoleCard
            icon={<HandHeart className="w-12 h-12" />}
            title="Volunteer"
            description="Share your skills and time with organizations that need you most"
            features={["AI-powered matching", "Build experience", "Verified opportunities"]}
            gradient="from-purple-600 to-purple-700"
          />
          <RoleCard
            icon={<Building2 className="w-12 h-12" />}
            title="NGO"
            description="Reach thousands of donors and volunteers on India's most trusted platform"
            features={["Raise funds transparently", "Find skilled volunteers", "Build credibility"]}
            gradient="from-emerald-600 to-emerald-700"
          />
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of donors, volunteers, and NGOs creating real impact through transparent, 
            blockchain-verified contributions.
          </p>
          <Link href="/register">
            <button className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-xl transition-all shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-900/70 hover:scale-105 flex items-center gap-3 mx-auto">
              Get Started for Free
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">NGO Marketplace</span>
              </div>
              <p className="text-slate-400 text-sm">
                Empowering change through transparency and technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
                <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2026 NGO Marketplace. Built for a better world.</p>
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ icon, value, label, color }: any) {
  return (
    <div className="group relative p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}

function StepCard({ number, icon, title, description, gradient }: any) {
  return (
    <div className="relative p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          {number}
        </span>
      </div>
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function FeatureItem({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="w-8 h-8 bg-emerald-900/20 rounded-lg flex items-center justify-center text-emerald-400 flex-shrink-0">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="relative p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-slate-700 transition-all group">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function RoleCard({ icon, title, description, features, gradient }: any) {
  return (
    <div className="relative p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group hover:scale-105">
      <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}