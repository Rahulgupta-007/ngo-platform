"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { Search, Filter, Heart, ArrowRight, MapPin, Target } from "lucide-react";

export default function ExploreCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    // This endpoint is public (no auth needed)
    api.get("/campaigns")
      .then((res) => setCampaigns(res.data))
      .catch((err) => console.error("Failed to load campaigns"))
      .finally(() => setLoading(false));
  }, []);

  // Filter Logic
  const filteredCampaigns = campaigns.filter((c: any) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const isActive = c.status === 'active'; // Only show active ones

    return matchesSearch && matchesCategory && isActive;
  });

  const categories = ["All", "Education", "Medical", "Environment", "Disaster Relief", "Animal Welfare"];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Navbar (Simplified) */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                </div>
                NGO Marketplace
            </Link>
            <div className="flex gap-4">
                <Link href="/login" className="text-slate-300 hover:text-white px-4 py-2">Login</Link>
                <Link href="/register" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold">Join Now</Link>
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header & Search */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Causes
            </h1>
            <p className="text-slate-400 text-lg mb-8">
                Discover verified campaigns and make a difference today.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search campaigns..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Category Dropdown */}
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select 
                        className="w-full md:w-48 pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-emerald-500 outline-none appearance-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
            <div className="text-center py-20 text-slate-500">Loading campaigns...</div>
        ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
                <p className="text-xl">No campaigns found matching your search.</p>
                <button 
                    onClick={() => {setSearchTerm(""); setCategoryFilter("All")}}
                    className="mt-4 text-emerald-400 hover:underline"
                >
                    Clear Filters
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCampaigns.map((c: any) => (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all group hover:-translate-y-1">
                        {/* Card Image Placeholder */}
                        <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-800 flex items-center justify-center relative">
                            <Target className="w-12 h-12 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                                {c.category}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{c.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{c.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-emerald-400">₹{c.raisedAmount.toLocaleString()}</span>
                                    <span className="text-slate-500">of ₹{c.targetAmount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-emerald-500 h-full rounded-full" 
                                        style={{ width: `${Math.min((c.raisedAmount/c.targetAmount)*100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                                <MapPin size={14} />
                                {c.location || "India"}
                            </div>

                            <button 
                                onClick={() => router.push('/login')} 
                                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                Donate Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}