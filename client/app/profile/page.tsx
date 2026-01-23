"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "" // mapped to description for NGO
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUserData(res.data.user);
      setHistory(res.data.history);
      setFormData({
        name: res.data.user.name || "",
        phone: res.data.user.phone || "",
        location: res.data.user.location || "",
        bio: res.data.user.description || ""
      });
      setLoading(false);
    } catch (err) {
      alert("Failed to load profile");
      router.push('/dashboard');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', formData);
      alert("Profile Updated Successfully! ✅");
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="text-white text-center p-20">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        
        <button onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: User Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                {userData.name[0].toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <span className="bg-slate-800 px-3 py-1 rounded-full text-sm text-emerald-400 mt-2 uppercase font-semibold">
                {userData.role}
              </span>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold">Full Name</label>
                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <User size={16} className="text-slate-500" />
                  <input 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-transparent outline-none w-full disabled:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase font-bold">Email</label>
                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 opacity-50 cursor-not-allowed">
                  <Mail size={16} className="text-slate-500" />
                  <span className="text-slate-400">{userData.email}</span>
                </div>
              </div>

              {userData.role === 'ngo' && (
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Location</label>
                    <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <MapPin size={16} className="text-slate-500" />
                    <input 
                        disabled={!isEditing}
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="bg-transparent outline-none w-full disabled:text-slate-400"
                    />
                    </div>
                </div>
              )}

              {isEditing ? (
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold flex justify-center items-center gap-2">
                        <Save size={18} /> Save
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 bg-slate-800 rounded-xl">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold">
                  Edit Profile
                </button>
              )}
            </form>
          </div>

          {/* RIGHT: History & Activity */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-6">Activity History</h3>

            {/* VOLUNTEER HISTORY */}
            {userData.role === 'volunteer' && (
              <div className="space-y-4">
                {history?.applications?.length === 0 ? (
                    <div className="p-8 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500">
                        You haven't applied to any opportunities yet.
                    </div>
                ) : (
                    history?.applications?.map((app: any) => (
                        <div key={app.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg">{app.postTitle}</h4>
                                <p className="text-sm text-slate-400">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
                                app.status === 'accepted' ? 'bg-emerald-900/50 text-emerald-400' : 
                                app.status === 'rejected' ? 'bg-red-900/50 text-red-400' : 
                                'bg-yellow-900/50 text-yellow-400'
                            }`}>
                                {app.status}
                            </span>
                        </div>
                    ))
                )}
              </div>
            )}

            {/* DONOR HISTORY */}
            {userData.role === 'donor' && (
               <div className="space-y-4">
               {history?.donations?.length === 0 ? (
                   <div className="p-8 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500">
                       You haven't made any donations yet.
                   </div>
               ) : (
                   history?.donations?.map((don: any) => (
                       <div key={don.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                           <div>
                               <h4 className="font-bold text-lg">Donation to Campaign</h4>
                               <p className="text-sm text-slate-400">{new Date(don.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                                <p className="text-xl font-bold text-emerald-400">₹{don.amount}</p>
                                <span className="text-xs text-slate-500 uppercase">Completed</span>
                           </div>
                       </div>
                   ))
               )}
             </div>
            )}

            {/* NGO (Just a placeholder for now) */}
            {userData.role === 'ngo' && (
               <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                   <p className="text-slate-400">
                       As an NGO, you can manage your detailed history and logs from the 
                       <span className="text-emerald-400 font-bold cursor-pointer" onClick={() => router.push('/dashboard')}> Dashboard</span>.
                   </p>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}