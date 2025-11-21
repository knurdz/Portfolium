"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import {
  Home,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Upload,
  Loader2,
  Eye,
  Check,
  ExternalLink,
  Save,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";

interface User {
  name: string;
  email: string;
  emailVerification: boolean;
}

interface DashboardLayoutProps {
  user: User;
  existingPortfolio?: {
    subdomain: string;
    htmlContent: string;
  } | null;
}

const sidebarLinks = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: MessageSquare, label: "Conversations", href: "/dashboard/conversations" },
  { icon: FileText, label: "Projects", href: "/dashboard/projects" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ user, existingPortfolio }: DashboardLayoutProps) {
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<string>(existingPortfolio?.htmlContent || "");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [subdomain, setSubdomain] = useState(existingPortfolio?.subdomain || "");
  const [subdomainError, setSubdomainError] = useState("");
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState(
    existingPortfolio ? `https://${existingPortfolio.subdomain}.portfolio.knurdz.org` : ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subdomainCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check subdomain availability with debounce
  const checkSubdomain = async (value: string) => {
    if (value.length < 3) {
      setSubdomainAvailable(null);
      setSubdomainError("Subdomain must be at least 3 characters");
      return;
    }

    setIsCheckingSubdomain(true);
    setSubdomainError("");

    try {
      const response = await fetch(`/api/check-subdomain?subdomain=${encodeURIComponent(value)}`);
      const data = await response.json();

      if (data.error) {
        setSubdomainError(data.error);
        setSubdomainAvailable(false);
      } else if (data.available) {
        setSubdomainAvailable(true);
        setSubdomainError("");
      } else {
        setSubdomainAvailable(false);
        setSubdomainError("This subdomain is already taken");
      }
    } catch {
      setSubdomainError("Failed to check subdomain");
      setSubdomainAvailable(false);
    } finally {
      setIsCheckingSubdomain(false);
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(value);
    setSubdomainAvailable(null);
    setSubdomainError("");

    // Clear existing timeout
    if (subdomainCheckTimeout.current) {
      clearTimeout(subdomainCheckTimeout.current);
    }

    // Check subdomain after 500ms of no typing
    if (value.length >= 3) {
      subdomainCheckTimeout.current = setTimeout(() => {
        checkSubdomain(value);
      }, 500);
    } else if (value.length > 0) {
      setSubdomainError("Subdomain must be at least 3 characters");
    }
  };

  const handleSavePortfolio = async () => {
    if (!generatedPortfolio || !subdomain) {
      addToast({
        title: "Missing Information",
        description: "Please generate a portfolio and choose a subdomain first",
        variant: "error",
      });
      return;
    }

    if (!subdomainAvailable && !existingPortfolio) {
      addToast({
        title: "Subdomain Unavailable",
        description: "Please choose an available subdomain",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/save-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          htmlContent: generatedPortfolio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save portfolio");
      }

      setPortfolioUrl(data.url);
      addToast({
        title: "Portfolio Published!",
        description: `Your portfolio is now live at ${subdomain}.portfolio.knurdz.org`,
        variant: "success",
        duration: 7000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save portfolio";
      addToast({
        title: "Save Failed",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleGeneratePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.trim() && !cvFile) return;

    setIsGenerating(true);
    setGeneratedPortfolio("");

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("details", userDetails);
      formData.append("model", selectedModel);
      if (cvFile) {
        formData.append("cv", cvFile);
      }

      console.log("Sending request to generate portfolio...");
      
      // Call API to generate portfolio using Gemini
      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}\n\nDetails: ${data.details}` : data.error;
        throw new Error(errorMsg || "Failed to generate portfolio");
      }

      setGeneratedPortfolio(data.portfolio);
      addToast({
        title: "Portfolio Generated!",
        description: "Your portfolio has been created. Review it and click Publish to make it live.",
        variant: "success",
      });
      console.log("Portfolio generated successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate portfolio. Please try again.";
      console.error("Error generating portfolio:", errorMessage);
      console.error("Full error:", error);
      addToast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-[#4F46E5] to-[#6366F1] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#111827]">Portfolium</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#6B7280] rounded-lg hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="px-3 py-2 mb-2 bg-[#F9FAFB] rounded-lg">
              <p className="text-sm font-medium text-[#111827] truncate">{user.name}</p>
              <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start gap-3 text-[#EF4444] hover:text-[#DC2626] hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E7EB] px-4 lg:px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-[#111827]">Portfolio Generator</h1>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Input Section */}
          <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] flex flex-col bg-white">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827] mb-2">Your Information</h2>
              <p className="text-sm text-[#6B7280]">
                Enter your details or upload your CV to generate a portfolio page
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleGeneratePortfolio} className="space-y-6">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-sm font-medium text-[#111827]">
                    AI Model
                  </Label>
                  <select
                    id="model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Faster)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Better Quality)</option>
                  </select>
                  <p className="text-xs text-[#6B7280]">
                    Flash: Faster generation | Pro: Higher quality output
                  </p>
                </div>

                {/* Subdomain Input */}
                <div className="space-y-2">
                  <Label htmlFor="subdomain" className="text-sm font-medium text-[#111827]">
                    Choose Your Subdomain
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      type="text"
                      value={subdomain}
                      onChange={handleSubdomainChange}
                      placeholder="johndoe"
                      className="flex-1 placeholder:text-gray-400"
                      disabled={!!existingPortfolio}
                    />
                    {isCheckingSubdomain && (
                      <Loader2 className="w-5 h-5 text-[#6B7280] animate-spin" />
                    )}
                    {subdomainAvailable === true && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {subdomainAvailable === false && subdomain.length >= 3 && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Your portfolio will be at: <span className="font-mono font-medium">{subdomain || "yourname"}.portfolio.knurdz.org</span>
                  </p>
                  {subdomainError && (
                    <p className="text-xs text-red-600">{subdomainError}</p>
                  )}
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#4F46E5] hover:underline flex items-center gap-1"
                    >
                      View your live portfolio <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Text Input for Details */}
                <div className="space-y-2">
                  <Label htmlFor="details" className="text-sm font-medium text-[#111827]">
                    Enter Your Details
                  </Label>
                  <Textarea
                    id="details"
                    value={userDetails}
                    onChange={(e) => setUserDetails(e.target.value)}
                    placeholder="Tell us about yourself... Include:&#10;• Full Name&#10;• Professional Title&#10;• Skills & Expertise&#10;• Work Experience&#10;• Education&#10;• Projects&#10;• Contact Information&#10;• Social Media Links"
                    className="min-h-[300px] text-sm placeholder:text-gray-400"
                    rows={12}
                  />
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E5E7EB]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-[#6B7280]">OR</span>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="cv" className="text-sm font-medium text-[#111827]">
                    Upload Your CV/Resume
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cv"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {cvFile ? cvFile.name : "Choose File"}
                    </Button>
                    {cvFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCvFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Supported formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  type="submit"
                  disabled={(!userDetails.trim() && !cvFile) || isGenerating}
                  className="w-full h-11 bg-[#4F46E5] hover:bg-[#3730A3] text-white font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Portfolio...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Portfolio
                    </>
                  )}
                </Button>

                {/* Save Portfolio Button */}
                {generatedPortfolio && (
                  <Button
                    type="button"
                    onClick={handleSavePortfolio}
                    disabled={!subdomain || isSaving || (!subdomainAvailable && !existingPortfolio)}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving Portfolio...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {existingPortfolio ? "Update Portfolio" : "Publish Portfolio"}
                      </>
                    )}
                  </Button>
                )}
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:w-1/2 flex flex-col bg-[#F9FAFB]">
            <div className="p-6 border-b border-[#E5E7EB] bg-white flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111827]">Preview</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {!generatedPortfolio && !isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 bg-linear-to-br from-[#4F46E5] to-[#6366F1] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2">
                    Your Portfolio Preview
                  </h3>
                  <p className="text-[#6B7280] max-w-md">
                    Fill in your details or upload your CV, then click &quot;Generate Portfolio&quot; to see your personalized portfolio page here.
                  </p>
                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-12 h-12 text-[#4F46E5] animate-spin mb-4" />
                  <p className="text-[#6B7280]">Generating your portfolio with AI...</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                  <iframe
                    srcDoc={generatedPortfolio}
                    className="w-full h-[600px] border-0"
                    title="Portfolio Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
