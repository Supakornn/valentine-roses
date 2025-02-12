"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Copy, Check, Key } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Rose, ROSE_VARIANTS, RoseVariantId } from "@/components/ui/rose";
import { AnimatedRose } from "@/components/ui/animated-rose";

const ROSE_TYPES: Array<{ id: RoseVariantId; name: string; meaning: string }> = [
  { id: "red", name: "Red Rose", meaning: "True Love" },
  { id: "pink", name: "Pink Rose", meaning: "Sweetness" },
  { id: "white", name: "White Rose", meaning: "Purity" },
  { id: "yellow", name: "Yellow Rose", meaning: "Friendship" }
];

const CARD_THEMES = [
  { id: "romantic", name: "Romantic", bg: "bg-gradient-to-r from-pink-200 to-red-200" },
  { id: "elegant", name: "Elegant", bg: "bg-gradient-to-r from-purple-200 to-pink-200" },
  { id: "classic", name: "Classic", bg: "bg-gradient-to-r from-rose-100 to-teal-100" }
];

const generateAccessKey = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function RoseSender() {
  const [selectedRose, setSelectedRose] = useState<RoseVariantId | "">("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [message, setMessage] = useState("");
  const [secretMessage, setSecretMessage] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAccessKey = generateAccessKey();
    setAccessKey(newAccessKey);

    try {
      const roseId = crypto.randomUUID();
      await setDoc(doc(db, "roses", roseId), {
        rose: selectedRose,
        theme: selectedTheme,
        message,
        secretMessage,
        accessKey: newAccessKey,
        createdAt: new Date().toISOString()
      });

      const shareUrl = `${window.location.origin}/rose/${roseId}`;
      setShareUrl(shareUrl);
      setShowShareDialog(true);
    } catch (error) {
      console.error("Error saving rose:", error);
      alert("Failed to save your rose. Please try again.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(accessKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRoseSelect = (value: string) => {
    setSelectedRose(value as RoseVariantId);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">🌹 Choose Your Rose</label>
              <Select value={selectedRose} onValueChange={handleRoseSelect}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a rose" />
                </SelectTrigger>
                <SelectContent>
                  {ROSE_TYPES.map((rose) => (
                    <SelectItem key={rose.id} value={rose.id} className="py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 inline-flex items-center justify-center relative shrink-0">
                          <Rose color={ROSE_VARIANTS[rose.id].color} className="absolute" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium leading-none truncate">
                            {rose.name}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">{rose.meaning}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRose && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 inline-flex items-center justify-center bg-white rounded-full shadow-sm relative shrink-0">
                    <AnimatedRose
                      color={ROSE_VARIANTS[selectedRose].color}
                      className="absolute transform scale-[0.1]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {ROSE_TYPES.find((r) => r.id === selectedRose)?.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {ROSE_TYPES.find((r) => r.id === selectedRose)?.meaning}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">🎨 Choose Card Theme</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_THEMES.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md ${theme.bg} shadow-sm inline-block`} />
                        <div className="text-sm font-medium text-gray-700">{theme.name}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">💌 Your Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">💌 Secret Message</label>
              <Textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Add a hidden message..."
                className="h-24"
              />
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
              <Send className="w-4 h-4 mr-2" />
              Create Rose Card
            </Button>
          </form>
        </Card>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📬 Share Your Rose</DialogTitle>
            <DialogDescription>
              Share the link and provide the access key to your special someone
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Rose Link</label>
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={handleCopyLink} className="shrink-0">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Access Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input value={accessKey} readOnly className="pr-10" />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button variant="outline" size="icon" onClick={handleCopyKey} className="shrink-0">
                  {copiedKey ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Share this key to unlock the rose card.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
