"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  ArrowLeft, Rocket, Target, FileText, Calendar, Tag,
  DollarSign, MapPin, Image, CheckCircle2, AlertCircle,
  Info, Upload
} from "lucide-react";

export default function CreateCampaign() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    category: "Education",
    deadline: "",
    location: "",
    beneficiaries: "",
    impact: "",
    // Image upload would go here
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: "Education", emoji: "📚", color: "blue" },
    { value: "Healthcare", emoji: "🏥", color: "red" },
    { value: "Environment", emoji: "🌱", color: "green" },
    { value: "Disaster Relief", emoji: "🆘", color: "orange" },
    { value: "Animal Welfare", emoji: "🐾", color: "purple" },
    { value: "Women Empowerment", emoji: "💪", color: "pink" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.title || !formData.description || !formData.targetAmount) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (Number(formData.targetAmount) < 1000) {
      setError("Minimum target amount is ₹1,000");
      setLoading(false);
      return;
    }

    try {
      await api.post("/campaigns", {
        ...formData,
        targetAmount: Number(formData.targetAmount)
      });

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create campaign";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.category || !formData.targetAmount) {
        setError("Please complete all fields in this step");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> 
          <span>Back to Dashboard</span>
        </button>

        {/* Main Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Launch Your Campaign</h1>
                <p className="text-emerald-100 mt-1">Share your cause and start making an impact</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Step number={1} active={step === 1} completed={step > 1} label="Basic Info" />
              <div className={`h-1 w-16 rounded ${step > 1 ? 'bg-white' : 'bg-white/30'} transition-all`}></div>
              <Step number={2} active={step === 2} completed={step > 2} label="Details" />
              <div className={`h-1 w-16 rounded ${step > 2 ? 'bg-white' : 'bg-white/30'} transition-all`}></div>
              <Step number={3} active={step === 3} completed={false} label="Review" />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold text-sm">Error</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-800 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-400 font-semibold text-sm">Campaign created successfully! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Campaign Title <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Build a School for 500 Children in Rural Bihar"
                      className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <p className="text-slate-500 text-xs mt-2">Make it clear and compelling</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        Category <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData({...formData, category: cat.value})}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              formData.category === cat.value
                                ? 'border-emerald-500 bg-emerald-900/20'
                                : 'border-slate-700 bg-slate-950/50 hover:border-slate-600'
                            }`}
                          >
                            <div className="text-2xl mb-1">{cat.emoji}</div>
                            <div className="text-sm font-semibold text-white">{cat.value}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Target Amount (₹) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                        <input 
                          type="number" 
                          placeholder="50,000"
                          className="w-full pl-10 pr-4 py-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                          value={formData.targetAmount}
                          onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                        />
                      </div>
                      <p className="text-slate-500 text-xs mt-2">Minimum ₹1,000</p>

                      <div className="mt-4">
                        <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-400" />
                          Campaign Deadline
                        </label>
                        <input 
                          type="date" 
                          className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                          value={formData.deadline}
                          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      Next Step
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Detailed Information */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Campaign Description <span className="text-red-400">*</span>
                    </label>
                    <textarea 
                      rows={6}
                      placeholder="Tell your story... What is the cause? Why does it matter? How will funds be used?"
                      className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    <p className="text-slate-500 text-xs mt-2">Be detailed and transparent about fund usage</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        Location
                      </label>
                      <input 
                        type="text" 
                        placeholder="City, State"
                        className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        Number of Beneficiaries
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 500 children"
                        className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        value={formData.beneficiaries}
                        onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Expected Impact
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="What will be the outcome? How will this change lives?"
                      className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      value={formData.impact}
                      onChange={(e) => setFormData({...formData, impact: e.target.value})}
                    />
                  </div>

                  {/* Image Upload Placeholder */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4 text-emerald-400" />
                      Campaign Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-slate-600 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
                      <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      Next Step
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Submit */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-400 font-semibold text-sm">Review Your Campaign</p>
                      <p className="text-blue-300 text-sm mt-1">Please review all details before publishing. You can edit later from your dashboard.</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 space-y-4">
                    <ReviewItem label="Title" value={formData.title} />
                    <ReviewItem label="Category" value={formData.category} />
                    <ReviewItem label="Target Amount" value={`₹${Number(formData.targetAmount).toLocaleString()}`} />
                    {formData.deadline && <ReviewItem label="Deadline" value={new Date(formData.deadline).toLocaleDateString()} />}
                    <ReviewItem label="Description" value={formData.description} />
                    {formData.location && <ReviewItem label="Location" value={formData.location} />}
                    {formData.beneficiaries && <ReviewItem label="Beneficiaries" value={formData.beneficiaries} />}
                    {formData.impact && <ReviewItem label="Expected Impact" value={formData.impact} />}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={loading || success}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg text-lg disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Publishing...</span>
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Success!</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          <span>Publish Campaign</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-400" />
            Tips for a Successful Campaign
          </h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Use a clear, descriptive title that explains your cause</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Be transparent about how funds will be used</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Add photos or documents to build trust</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Set a realistic funding goal and deadline</span>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Helper Components
function Step({ number, active, completed, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
        completed 
          ? 'bg-white text-emerald-600' 
          : active 
            ? 'bg-white text-emerald-600 ring-4 ring-white/30' 
            : 'bg-white/20 text-white/60'
      }`}>
        {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-white' : 'text-white/60'}`}>{label}</span>
    </div>
  );
}

function ReviewItem({ label, value }: any) {
  return (
    <div className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <p className="text-slate-500 text-sm mb-1">{label}</p>
      <p className="text-white">{value || "—"}</p>
    </div>
  );
}