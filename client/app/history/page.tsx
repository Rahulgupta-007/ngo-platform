"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, History, Wallet } from "lucide-react";

export default function DonationHistory() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/campaigns/my-donations")
      .then((res) => setDonations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <History className="text-emerald-500" /> Donation History
        </h1>

        {loading ? (
          <p className="text-slate-500">Loading records...</p>
        ) : donations.length === 0 ? (
          <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center text-slate-500">
            No donations yet. Go make a difference! 🌍
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((d: any) => (
              <div key={d.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center hover:border-emerald-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{d.campaignTitle}</h3>
                    <p className="text-xs text-slate-500">{new Date(d.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    {d.method === 'ETH' ? 'Ξ' : '₹'}{d.amount}
                  </p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {d.method}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}