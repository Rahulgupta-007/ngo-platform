"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  Users, DollarSign, Activity, CheckCircle, XCircle, 
  PauseCircle, Search, MapPin, TrendingUp, Heart,
  Clock, AlertCircle, Award, Target, ChevronRight,
  Upload, Plus, Edit
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [volunteerPosts, setVolunteerPosts] = useState<any[]>([]);
  const [filterState, setFilterState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);

        if (userData.role === 'admin') {
          loadAdminData();
        } else if (userData.role === 'ngo') {
          loadNGOData();
        } else {
          loadPublicData();
        }
    } catch (e) {
        localStorage.removeItem("token");
        router.push("/login");
    }
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, campRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/campaigns')
      ]);
      setStats(statsRes.data);
      // SAFETY CHECK: Ensure it is an array
      setCampaigns(Array.isArray(campRes.data) ? campRes.data : []);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNGOData = async () => {
    try {
      setLoading(true);
      const [campRes, volRes] = await Promise.all([
        api.get('/campaigns/my-campaigns'), // NGO's own campaigns
        api.get('/volunteer-posts/my-posts') // NGO's volunteer posts
      ]);
      setCampaigns(Array.isArray(campRes.data) ? campRes.data : []);
      setVolunteerPosts(Array.isArray(volRes.data) ? volRes.data : []);
    } catch (error) {
      console.error("Failed to load NGO data:", error);
      setCampaigns([]);
      setVolunteerPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPublicData = async () => {
    try {
      setLoading(true);
      const [campRes, volRes] = await Promise.all([
        api.get('/campaigns'), // All active campaigns
        api.get('/volunteer-posts') // All volunteer opportunities
      ]);
      setCampaigns(Array.isArray(campRes.data) ? campRes.data : []);
      setVolunteerPosts(Array.isArray(volRes.data) ? volRes.data : []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setCampaigns([]);
      setVolunteerPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNGO = async (id: number) => {
    try {
      await api.post('/admin/approve-ngo', { id });
      loadAdminData();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleRejectNGO = async (id: number) => {
    if(!confirm("Reject this NGO application?")) return;
    try {
      await api.post('/admin/reject-ngo', { id });
      loadAdminData();
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleStopCampaign = async (id: number) => {
    if(!confirm("Stop this campaign?")) return;
    try {
      await api.post('/admin/stop-campaign', { id });
      loadAdminData();
    } catch (error) {
      console.error("Failed to stop campaign:", error);
    }
  };

  // --- NEW: Apply Logic for Volunteers ---
  const handleApply = async (postId: string) => {
    if(!confirm("Apply for this position?")) return;
    try {
      await api.post('/volunteer-posts/apply', { postId });
      alert("Application Sent! 🚀");
      // Refresh data
      if (user.role === 'ngo') loadNGOData();
      else loadPublicData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // --- 🛡️ ADMIN DASHBOARD ---
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Admin Control Center
                </h1>
                <p className="text-slate-400 mt-1">Manage NGO marketplace and approvals</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Logged in as</p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<Users className="w-6 h-6" />} 
              label="Total Users" 
              value={stats?.counts?.total || 0}
              trend="+12%"
              gradient="from-blue-600 to-blue-700"
            />
            <StatCard 
              icon={<Activity className="w-6 h-6" />} 
              label="Active NGOs" 
              value={stats?.counts?.ngos || 0}
              trend="+5%"
              gradient="from-emerald-600 to-emerald-700"
            />
            <StatCard 
              icon={<Heart className="w-6 h-6" />} 
              label="Volunteers" 
              value={stats?.counts?.volunteers || 0}
              trend="+18%"
              gradient="from-purple-600 to-purple-700"
            />
            <StatCard 
              icon={<DollarSign className="w-6 h-6" />} 
              label="Total Raised" 
              value={`₹${(stats?.finance?.totalRaised || 0).toLocaleString()}`}
              trend="+24%"
              gradient="from-yellow-600 to-orange-600"
            />
          </div>

          {/* Pending NGO Approvals */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Pending NGO Registration Requests</h3>
                  <p className="text-sm text-slate-400">
                    {stats?.pendingNGOs?.length || 0} organization(s) awaiting verification
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {stats?.pendingNGOs?.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-400">All caught up! No pending NGO approvals.</p>
                </div>
              ) : (
                stats?.pendingNGOs?.map((ngo: any) => (
                  <div key={ngo.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{ngo.name}</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            Gov ID: {ngo.govId}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {ngo.location || "Location N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Applied: {new Date(ngo.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Contact: {ngo.email}
                          </span>
                        </div>
                        {ngo.description && (
                          <p className="mt-2 text-sm text-slate-300 line-clamp-2">{ngo.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveNGO(ngo.id)} 
                          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectNGO(ngo.id)} 
                          className="bg-red-600/20 hover:bg-red-600/30 border border-red-600 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Campaign Monitoring */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Campaign Monitoring</h3>
                  <p className="text-sm text-slate-400">Oversee all active fundraising campaigns</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* SAFETY CHECK: Prevent slice error */}
              {(Array.isArray(campaigns) ? campaigns : []).slice(0, 6).map((c: any) => (
                <div key={c.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold line-clamp-1">{c.title}</h4>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        c.status === 'active' 
                          ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' 
                          : 'bg-red-900/50 text-red-400 border border-red-800'
                      }`}>
                        {c.status}
                      </span>
                      {c.status === 'active' && (
                        <button 
                          onClick={() => handleStopCampaign(c.id)} 
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Stop Campaign"
                        >
                          <PauseCircle size={18}/>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${Math.min((c.raisedAmount/c.targetAmount)*100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-semibold">₹{c.raisedAmount?.toLocaleString()}</span>
                      <span className="text-slate-400">of ₹{c.targetAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 🏢 NGO DASHBOARD ---
  if (user.role === 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {user.organizationName || user.name} Dashboard
                </h1>
                <p className="text-slate-400">
                  Manage your campaigns and volunteer opportunities
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {user.name?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button 
              onClick={() => router.push('/create-campaign')}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 p-6 rounded-2xl flex items-center justify-between group transition-all shadow-lg"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Create New Campaign</h3>
                <p className="text-emerald-100 text-sm">Start a fundraising campaign</p>
              </div>
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={() => router.push('/create-volunteer-post')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 p-6 rounded-2xl flex items-center justify-between group transition-all shadow-lg"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Post Volunteer Opportunity</h3>
                <p className="text-purple-100 text-sm">Find skilled volunteers</p>
              </div>
              <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Your Campaigns */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Your Active Campaigns</h3>
                <p className="text-slate-400 mt-1">{campaigns.length} campaign(s) running</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c: any) => (
                <div key={c.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
                  <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <Target className="w-12 h-12 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl line-clamp-1">{c.title}</h3>
                      <button className="text-slate-400 hover:text-emerald-400">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{c.description}</p>
                    
                    <div className="space-y-2">
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all"
                          style={{ width: `${Math.min((c.raisedAmount/c.targetAmount)*100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-400 font-bold">₹{c.raisedAmount?.toLocaleString()}</span>
                        <span className="text-slate-400">₹{c.targetAmount?.toLocaleString()} goal</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Volunteer Posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Volunteer Opportunities</h3>
                <p className="text-slate-400 mt-1">{volunteerPosts.length} position(s) open</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {volunteerPosts.map((post: any) => (
                <div key={post.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{post.title}</h4>
                      <p className="text-sm text-slate-400">{post.skillsRequired?.join(', ')}</p>
                    </div>
                    <button className="text-slate-400 hover:text-purple-400">
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold">{post.applicants || 0} applicants</span>
                    <button 
  onClick={() => router.push(`/applications/${post.id}`)}
  className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
>
  View Applications <ChevronRight className="w-4 h-4" />
</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  

  // --- 🤝 VOLUNTEER / DONOR DASHBOARD ---
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const safeVolunteerPosts = Array.isArray(volunteerPosts) ? volunteerPosts : [];

  // 2. DEFINE CAMPAIGN FILTERS
  const filteredCampaigns = safeCampaigns
    .filter(c => (c.status || 'active').toLowerCase() === 'active') // Handles 'Active', 'active', or missing status
    .filter(c => !filterState || c.location?.toLowerCase().includes(filterState.toLowerCase()));

  // 3. DEFINE VOLUNTEER POST FILTERS (This was missing!)
  const filteredVolunteerPosts = safeVolunteerPosts
    .filter(p => !filterState || p.location?.toLowerCase().includes(filterState.toLowerCase()));

  // --- DEBUGGING LOGS (Optional) ---
  if (user.role !== 'ngo' && user.role !== 'admin') {
     console.log("🔥 DEBUG: Safe Campaigns:", safeCampaigns);
     console.log("🔥 DEBUG: Filtered Campaigns:", filteredCampaigns);
     console.log("🔥 DEBUG: Filtered Volunteer Posts:", filteredVolunteerPosts);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-slate-400">
                Role: <span className="uppercase text-emerald-400 font-semibold">{user.role}</span>
              </p>
            </div>
            <div onClick={() => router.push('/profile')}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
              {user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickStatCard 
            icon={<Heart />}
            label={user.role === 'volunteer' ? "Hours Contributed" : "Total Donated"}
            value={user.role === 'volunteer' ? "24h" : "₹5,000"}
            color="from-purple-600 to-purple-700"
          />
          <QuickStatCard 
            icon={<Activity />}
            label="Active Causes"
            value={filteredCampaigns.length}
            color="from-emerald-600 to-emerald-700"
          />
          <QuickStatCard 
            icon={<Award />}
            label={user.role === 'volunteer' ? "NGOs Helped" : "Impact Score"}
            value={user.role === 'volunteer' ? "3" : "95"}
            color="from-blue-600 to-blue-700"
          />
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="text-emerald-400 w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Explore Opportunities</h3>
          </div>
          <div className="flex gap-4">
            <input 
              placeholder="Filter by location (e.g. Gujarat, Mumbai)" 
              className="bg-slate-950/50 border border-slate-700 focus:border-emerald-500 p-3 rounded-xl text-white flex-1 outline-none transition-colors"
              onChange={(e) => setFilterState(e.target.value)}
              value={filterState}
            />
            <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Active Campaigns</h3>
              <p className="text-slate-400 mt-1">{filteredCampaigns.length} fundraising opportunities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((c: any) => (
              <div key={c.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{c.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${Math.min((c.raisedAmount/c.targetAmount)*100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-400 font-bold">₹{c.raisedAmount?.toLocaleString()}</span>
                      <span className="text-slate-400">₹{c.targetAmount?.toLocaleString()} goal</span>
                    </div>
                  </div>

                  <button 
  onClick={() => router.push(`/donate/${c.id}`)}
  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
>
  <Heart className="w-4 h-4" />
  Donate Now
</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Opportunities (Only for Volunteers) */}
        {user.role === 'volunteer' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Volunteer Opportunities</h3>
                <p className="text-slate-400 mt-1">{filteredVolunteerPosts.length} positions available</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVolunteerPosts.map((post: any) => (
                <div key={post.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-purple-700 transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{post.title}</h4>
                      <p className="text-sm text-slate-400">{post.ngoName}</p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{post.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.skillsRequired?.map((skill: string, i: number) => (
                      <span key={i} className="bg-purple-900/50 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CONNECTED APPLY BUTTON */}
                  <button 
                    onClick={() => handleApply(post.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                  >
                    Apply Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value, trend, gradient }: { icon: React.ReactNode, label: string, value: string | number, trend: string, gradient: string }) => (
  <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden`}>
    <div className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${gradient}`}></div>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
    <div className="absolute bottom-4 right-4 text-xs text-emerald-400 font-semibold flex items-center gap-1">
      <TrendingUp className="w-4 h-4" />
      {trend}
    </div>
  </div>
);

const QuickStatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex items-center gap-5`}>
    <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);