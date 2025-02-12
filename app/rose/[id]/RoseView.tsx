"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Rose, ROSE_VARIANTS, RoseVariantId } from "@/components/ui/rose";
import { AnimatedRose } from "@/components/ui/animated-rose";

interface RoseData {
  rose: RoseVariantId;
  theme: string;
  message: string;
  secretMessage?: string;
  accessKey: string;
}

export default function RoseView({ params }: { params: { id: string } }) {
  const [roseData, setRoseData] = useState<RoseData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchRose = async () => {
      try {
        const roseDoc = await getDoc(doc(db, "roses", params.id));
        if (roseDoc.exists()) {
          setRoseData(roseDoc.data() as RoseData);
        } else {
          setRoseData(null);
        }
      } catch (error) {
        console.error("Error fetching rose:", error);
        setRoseData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRose();
  }, [params.id]);

  const handleUnlock = () => {
    if (roseData && accessKey === roseData.accessKey) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Invalid access key. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-2xl text-pink-600">Loading your special message...</div>
      </div>
    );
  }

  if (!roseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-2xl text-pink-600">Rose not found</div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen items-center align-middle flex bg-gradient-to-b from-pink-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-xl text-center">
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse bg-pink-200 rounded-full blur-xl opacity-50"></div>
                <Rose color="#FF69B4" className="w-24 h-24 animate-sway" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">💖 Someone Sent You a Rose</h1>
                <p className="text-gray-600 mt-2">
                  Enter the access key to view your special message
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter access key..."
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="pr-10"
                  maxLength={6}
                />
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleUnlock} className="w-full bg-pink-600 hover:bg-pink-700">
                Unlock Rose
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const themeStyles =
    {
      romantic: "bg-gradient-to-r from-pink-200 to-red-200",
      elegant: "bg-gradient-to-r from-purple-200 to-pink-200",
      classic: "bg-gradient-to-r from-rose-100 to-teal-100"
    }[roseData.theme] || "bg-gradient-to-r from-pink-200 to-red-200";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-full">
        <Card className={`p-6 shadow-xl ${themeStyles}`}>
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedRose
                    color={ROSE_VARIANTS[roseData.rose].color}
                    className="transform scale-[0.4]"
                  />
                </div>
              </div>
              <div className="text-base font-medium text-gray-600">
                {ROSE_VARIANTS[roseData.rose].meaning}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">💐 Your Special Rose</h1>
              <div className="text-lg text-gray-700 p-4 bg-white/30 rounded-lg shadow-inner">
                {roseData.message}
              </div>

              {roseData.secretMessage && (
                <div className="mt-4 p-4 bg-white/50 rounded-lg shadow-inner border border-pink-100">
                  <div className="text-base text-pink-600 font-medium">💝 Secret Message</div>
                  <div
                    className="mt-6 p-8 bg-white/50 rounded-lg shadow-inner border border-pink-100 text-center cursor-pointer transition-all duration-300"
                    onClick={() => setIsRevealed(true)}
                  >
                    {isRevealed ? (
                      <p className="text-lg text-gray-700">{roseData.secretMessage}</p>
                    ) : (
                      <div className="text-lg">📩 Click to see it.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
