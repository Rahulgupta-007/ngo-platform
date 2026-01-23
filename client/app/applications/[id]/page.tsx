"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, User, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function ViewApplications() {
  const router = useRouter();
  const params = useParams(); // Get the Post ID from URL
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch applications for this specific post
    api.get(`/volunteer-posts/${params.id}/applications`)
      .then((res) => setApplications(res.data))
      .catch((err) => alert("Failed to load applications"))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-2">Volunteer Applications</h1>
        <p className="text-slate-400 mb-8">Reviewing applicants for your post.</p>

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center text-slate-500">
            No applications received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <div key={app.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center hover:border-slate-700 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{app.volunteerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Clock size={14} />
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        Status: {app.status || 'Pending'}
                    </span>
                    {/* Add Accept/Reject buttons here in future */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}