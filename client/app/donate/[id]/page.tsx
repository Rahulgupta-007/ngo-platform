"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { CreditCard, ArrowLeft, CheckCircle, Wallet, Lock } from "lucide-react";
import { ethers } from "ethers"; // <--- 1. IMPORT ETHERS
import DonationTrackerABI from "@/lib/DonationTracker.json";

export default function DonatePage() {
  const router = useRouter();
  const params = useParams();
  
  // State
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card'); // <--- 2. ADD PAYMENT METHOD STATE
  
  // Web3 State
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // 3. Connect Wallet Function
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } catch (err) {
        console.error(err);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalMethod = "Credit Card (Mock)"; // Default

      // --- 🅰️ SMART CONTRACT FLOW ---
      if (paymentMethod === 'crypto') {
        if (!isWalletConnected) {
            alert("Connect wallet first!");
            setLoading(false);
            return;
        }

        // Setup Provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // ⚠️ UPDATED FOR SEPOLIA TESTNET
const CONTRACT_ADDRESS = "0xe0355BCFC487d5D326261A2E0EF5e16891f4977D";
        // 1. Determine the correct ABI format (handles both Artifact objects and raw arrays)
const contractABI = DonationTrackerABI.abi || DonationTrackerABI;

// 2. Create Contract Instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        // Calculate Amount
        const ethAmount = (parseFloat(amount) * 0.000005).toFixed(18);
        const weiAmount = ethers.parseEther(ethAmount);

        // Send Transaction
        const tx = await contract.donate(params.id.toString(), { value: weiAmount });

        console.log("Transaction Hash:", tx.hash);
        await tx.wait(); 
        
        finalMethod = `Smart Contract (Tx: ${tx.hash.slice(0, 6)}...)`;
      } 
      // --- 🅱️ CARD FLOW ---
      else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // --- SAVE TO DB ---
      await api.post('/donations', {
        campaignId: params.id,
        amount: amount,
        paymentMethod: finalMethod
      });

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 3000);

    } catch (err: any) {
      console.error(err);
      // Handle generic errors or user rejection
      alert(err.reason || err.message || "Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
        <p className="text-slate-400">Your donation has been received successfully.</p>
        <p className="text-sm text-slate-500 mt-8">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6">
          <ArrowLeft size={18} /> Cancel
        </button>

        <h1 className="text-2xl font-bold mb-6">Make a Donation</h1>

        <form onSubmit={handleDonate} className="space-y-6">
          
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Amount (INR)</label>
           <input 
  type="number" 
  placeholder="e.g. 500" 
  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-2xl font-bold text-white focus:border-emerald-500 outline-none transition-colors"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  required
  min="0.0001" // <--- Allow small numbers
  step="any"   // <--- Allow decimals
/>
          </div>

          {/* 4. Payment Method Toggle UI */}
          <div className="grid grid-cols-2 gap-4">
            <div 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
                <CreditCard size={24} />
                <span className="text-sm font-bold">Card</span>
            </div>
            <div 
                onClick={() => setPaymentMethod('crypto')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${paymentMethod === 'crypto' ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
                <Wallet size={24} />
                <span className="text-sm font-bold">Crypto (ETH)</span>
            </div>
          </div>

          {/* Dynamic Content based on Selection */}
          {paymentMethod === 'card' ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-slate-400">Card Details</span>
                 <span className="text-xs font-mono text-slate-500">TEST MODE</span>
               </div>
               <input disabled className="w-full bg-slate-900 p-2 rounded text-sm text-slate-500 cursor-not-allowed mb-2" value="**** **** **** 4242" />
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl border border-purple-900/50">
                {!isWalletConnected ? (
                    <button 
                        type="button" 
                        onClick={connectWallet}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        <Wallet size={18} /> Connect MetaMask
                    </button>
                ) : (
                    <div className="text-center">
                        <p className="text-green-400 text-sm font-semibold flex items-center justify-center gap-1 mb-2">
                            <CheckCircle size={14} /> Wallet Connected
                        </p>
                        <p className="text-xs text-slate-500 break-all font-mono bg-slate-900 p-2 rounded">
                            {walletAddress}
                        </p>
                        <p className="mt-3 text-xs text-purple-300">
                            Estimated: {amount ? (parseFloat(amount) * 0.000005).toFixed(6) : "0"} ETH
                        </p>
                    </div>
                )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !amount || (paymentMethod === 'crypto' && !isWalletConnected)}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 ${
                paymentMethod === 'crypto' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-purple-900/20'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-900/20'
            }`}
          >
            {loading ? "Processing..." : paymentMethod === 'crypto' ? "Pay with Ethereum" : "Pay with Card"}
          </button>
        </form>

      </div>
    </div>
  );
}