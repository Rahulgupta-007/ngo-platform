"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { 
  User, Building2, HandHeart, ShieldCheck, ArrowRight, ArrowLeft,
  Mail, Lock, FileText, MapPin, Award, Eye, EyeOff, CheckCircle2,
  AlertCircle, Heart
} from "lucide-react";

export default function Register() {
  const router = useRouter();
  
  // Step Management
  const [step, setStep] = useState<"select" | "form">("select");
  const [role, setRole] = useState<"donor" | "ngo" | "volunteer" | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // NGO Fields
    govId: "",
    organizationType: "",
    location: "",
    description: "",
    // Volunteer Fields
    skills: "",
    state: "",
    availability: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Select Role Handler
  const handleRoleSelect = (selectedRole: "donor" | "ngo" | "volunteer") => {
    setRole(selectedRole);
    setStep("form");
    setError("");
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!role) {
      setError("Please select a role");
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (role === 'ngo' && !formData.govId) {
      setError("Government ID is required for NGO registration");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", { 
        ...formData, 
        role: role 
      });
      
      setSuccess(true);
      
      // Redirect after delay
      setTimeout(() => {
        if (role === 'ngo') {
          router.push("/login?message=verification-pending");
        } else {
          router.push("/login?message=registration-success");
        }
      }, 1500);
      
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1: ROLE SELECTION ---
  if (step === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Join Our Community</h1>
            <p className="text-slate-400 text-lg">Choose how you'd like to make a difference</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Donor Card */}
            <RoleCard
              icon={<User className="w-12 h-12" />}
              title="Donor"
              description="Support causes you care about with financial contributions"
              gradient="from-blue-600 to-blue-700"
              features={["Donate to campaigns", "Track your impact", "Transparent transactions"]}
              onClick={() => handleRoleSelect("donor")}
            />

            {/* Volunteer Card */}
            <RoleCard
              icon={<HandHeart className="w-12 h-12" />}
              title="Volunteer"
              description="Share your time and skills to help organizations"
              gradient="from-purple-600 to-purple-700"
              features={["Find opportunities", "Match with NGOs", "Build experience"]}
              onClick={() => handleRoleSelect("volunteer")}
            />

            {/* NGO Card */}
            <RoleCard
              icon={<Building2 className="w-12 h-12" />}
              title="NGO"
              description="Register your organization and connect with supporters"
              gradient="from-emerald-600 to-emerald-700"
              features={["Create campaigns", "Find volunteers", "Receive donations"]}
              onClick={() => handleRoleSelect("ngo")}
              badge="Verification Required"
            />
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // --- STEP 2: REGISTRATION FORM ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Back Button */}
        <button
          onClick={() => setStep("select")}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Change role</span>
        </button>

        {/* Form Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl">
          
          {/* Header with Role Badge */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getRoleGradient(role)} rounded-xl flex items-center justify-center`}>
                {getRoleIcon(role)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">
                  {role} Registration
                </h2>
                <p className="text-slate-400 text-sm">
                  {role === 'ngo' && "Your application will be reviewed by our team"}
                  {role === 'volunteer' && "Start making a difference today"}
                  {role === 'donor' && "Support causes you care about"}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold text-sm">Registration Failed</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-800 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-emerald-400 font-semibold text-sm">
                  {role === 'ngo' 
                    ? "Application submitted! Awaiting verification..." 
                    : "Registration successful! Redirecting to login..."}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label={role === 'ngo' ? "Organization Name" : "Full Name"}
                placeholder={role === 'ngo' ? "Help Foundation" : "Your name"}
                icon={<User className="w-5 h-5" />}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />

              <FormInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            {/* Role-Specific Fields */}
            {role === 'ngo' && (
              <div className="space-y-5 p-5 bg-emerald-900/10 border border-emerald-800/30 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Organization Verification Details</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Government Registration ID"
                    placeholder="FCRA/Trust No."
                    icon={<FileText className="w-5 h-5" />}
                    value={formData.govId}
                    onChange={(e) => setFormData({...formData, govId: e.target.value})}
                    required
                  />

                  <FormInput
                    label="Organization Type"
                    placeholder="Trust/Society/NGO"
                    icon={<Building2 className="w-5 h-5" />}
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                  />
                </div>

                <FormInput
                  label="Location (City, State)"
                  placeholder="Mumbai, Maharashtra"
                  icon={<MapPin className="w-5 h-5" />}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Organization Description
                  </label>
                  <textarea
                    placeholder="Tell us about your mission and work..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {role === 'volunteer' && (
              <div className="space-y-5 p-5 bg-purple-900/10 border border-purple-800/30 rounded-xl">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-2">
                  <Award className="w-5 h-5" />
                  <span>Volunteer Profile</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Your Skills"
                    placeholder="Teaching, Medical, Tech..."
                    icon={<Award className="w-5 h-5" />}
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  />

                  <FormInput
                    label="Location (State)"
                    placeholder="Gujarat"
                    icon={<MapPin className="w-5 h-5" />}
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>

                <FormInput
                  label="Availability"
                  placeholder="Weekends, Evenings, Full-time..."
                  icon={<User className="w-5 h-5" />}
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                />
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <FormInput
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <span>Create {role === 'ngo' ? 'Application' : 'Account'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-center text-slate-500 text-xs">
              By registering, you agree to our{" "}
              <Link href="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Login here
            </Link>
          </p>
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

// --- HELPER COMPONENTS ---

function RoleCard({ icon, title, description, gradient, features, onClick, badge }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  features: string[];
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-left transition-all hover:scale-105 group relative"
    >
      {badge && (
        <div className="absolute top-4 right-4 text-xs bg-yellow-900/20 border border-yellow-800 text-yellow-400 px-2 py-1 rounded-full font-semibold">
          {badge}
        </div>
      )}
      
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      
      <ul className="space-y-2">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-4 flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </div>
    </button>
  );
}

function FormInput({ label, type = "text", placeholder, icon, value, onChange, required = false }: {
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          required={required}
        />
      </div>
    </div>
  );
}

function getRoleGradient(role: string | null) {
  switch(role) {
    case 'donor': return 'from-blue-600 to-blue-700';
    case 'volunteer': return 'from-purple-600 to-purple-700';
    case 'ngo': return 'from-emerald-600 to-emerald-700';
    default: return 'from-slate-600 to-slate-700';
  }
}

function getRoleIcon(role: string | null) {
  switch(role) {
    case 'donor': return <User className="w-6 h-6 text-white" />;
    case 'volunteer': return <HandHeart className="w-6 h-6 text-white" />;
    case 'ngo': return <Building2 className="w-6 h-6 text-white" />;
    default: return <User className="w-6 h-6 text-white" />;
  }
}