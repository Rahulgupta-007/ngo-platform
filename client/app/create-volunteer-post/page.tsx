"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Briefcase, MapPin, AlignLeft, Award, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateVolunteerPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    skills: "" // Will convert to array before sending
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.skills) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Convert comma-separated string to Array for Backend
      const skillsArray = formData.skills.split(',').map(s => s.trim());

      await api.post("/volunteer-posts", {
        ...formData,
        skills: skillsArray
      });

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500); // Redirect to dashboard

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 flex justify-center items-center">
      
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Find Volunteers
            </h1>
            <p className="text-slate-400">
              Create a new opportunity to attract skilled helpers for your cause.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-800 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" />
              <p className="text-emerald-400 text-sm">Opportunity posted successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Opportunity Title</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Briefcase size={18} /></div>
                <input 
                  type="text" 
                  placeholder="e.g. Teaching English to Rural Kids"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            {/* Location & Skills Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><MapPin size={18} /></div>
                  <input 
                    type="text" 
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-purple-500 outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Required Skills</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Award size={18} /></div>
                  <input 
                    type="text" 
                    placeholder="e.g. Teaching, Medical, Driving"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-purple-500 outline-none"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Separate multiple skills with commas.</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
              <div className="relative">
                <div className="absolute left-3 top-4 text-slate-500"><AlignLeft size={18} /></div>
                <textarea 
                  rows={5}
                  placeholder="Describe the role, responsibilities, and impact..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-purple-500 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || success}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Publish Opportunity"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}