"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Eye
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PORTFOLIO_TEMPLATES } from "@/lib/templates";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "portfolio_preview";
  portfolioHtml?: string;
  jobId?: string;
}

const TEMPLATE_OPTIONS = Object.entries(PORTFOLIO_TEMPLATES).map(([id, template]) => ({
  id,
  name: template.name,
  imagePath: template.imagePath,
  description: template.description,
}));

export default function ConversationsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-assistant",
      role: "assistant",
      content: "Hi! I'm your AI Portfolio Assistant. I can help you build a stunning portfolio in minutes. To get started, you can tell me about yourself or choose a template style you'd like to use.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "That sounds interesting! I can incorporate those details into your portfolio. Which style would you like to use for the design?",
            type: "text"
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error in chat:", error);
      addToast({
        title: "Error",
        description: "Failed to process message",
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const handleGenerate = async (templateId: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: `Generate a portfolio using the ${templateId} template.` },
    ]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("details", messages.filter(m => m.role === "user").map(m => m.content).join("\n"));
      formData.append("template", templateId);
      formData.append("model", "groq");

      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to start generation");

      const { jobId } = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm generating your portfolio now! This usually takes about 30-60 seconds. I'll let you know as soon as it's ready.",
          jobId
        }
      ]);

      // Poll for status
      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/generate-portfolio/status?jobId=${jobId}`);
          if (!statusRes.ok) return;
          const status = await statusRes.json();

          if (status.status === "completed") {
            clearInterval(poll);
            setMessages((prev) => [
              ...prev,
                {
                  id: Date.now().toString(),
                  role: "assistant",
                  content: "Your portfolio is ready! You can preview it below.",
                  type: "portfolio_preview",
                  portfolioHtml: status.portfolio
                }
            ]);
            setIsLoading(false);
          } else if (status.status === "failed") {
            clearInterval(poll);
            setIsLoading(false);
            console.error("Generation failed:", status.error);
            addToast({ title: "Failed", description: status.error || "Generation failed", variant: "error" });
          }
        } catch (err) {
          clearInterval(poll);
          setIsLoading(false);
          console.error("Polling error:", err);
          addToast({ title: "Generation Failed", description: "Something went wrong", variant: "error" });
        }
      }, 3000);

    } catch (error) {
      console.error("Error generating portfolio:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.role === "user" ? "bg-violet-100 text-violet-600" : "bg-indigo-100 text-indigo-600"
              }`}>
                {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`rounded-2xl p-4 ${
                message.role === "user" 
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200" 
                  : "bg-slate-50 text-slate-900 border border-slate-100"
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.type === "portfolio_preview" && message.portfolioHtml && (
                  <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Portfolio Ready</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">Review and publish in dashboard</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="h-8 bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                      onClick={() => {
                        globalThis.location.href = "/dashboard";
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {messages.length >= 1 && !isLoading && !messages.some(m => m.type === "portfolio_preview") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {TEMPLATE_OPTIONS.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleGenerate(tmpl.id)}
                className="text-left rounded-xl border border-slate-200 hover:border-violet-500 hover:ring-1 hover:ring-violet-500 transition-all bg-white group shadow-xs overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full relative bg-slate-100 overflow-hidden">
                  <Image 
                    src={tmpl.imagePath} 
                    alt={tmpl.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-slate-900">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500">{tmpl.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-xs font-medium text-slate-500">AI is crafting your response...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me more about yourself or your skills..."
            className="h-12 rounded-xl focus-visible:ring-violet-500 border-slate-200 bg-white"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-xl bg-violet-600 hover:bg-violet-700 shrink-0 shadow-lg shadow-violet-200 transition-transform active:scale-95"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}
