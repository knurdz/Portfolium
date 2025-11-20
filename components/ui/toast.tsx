"use client";

import * as React from "react";
import { X } from "lucide-react";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error";
  duration?: number;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = React.useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 w-full max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

interface ToastComponentProps extends ToastProps {
  onClose: () => void;
}

function Toast({ title, description, variant = "default", onClose }: ToastComponentProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const variantStyles = {
    default: "bg-white border-[#E5E7EB]",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
  };

  const iconStyles = {
    default: "text-[#4F46E5]",
    success: "text-green-600",
    error: "text-red-600",
  };

  return (
    <div
      className={`pointer-events-auto transform transition-all duration-300 ease-out ${
        isExiting
          ? "translate-y-0 opacity-0 scale-95"
          : "translate-y-0 opacity-100 scale-100"
      }`}
      style={{
        animation: isExiting ? undefined : "slideIn 0.3s ease-out",
      }}
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${variantStyles[variant]}`}
      >
        {variant === "success" && (
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles[variant]}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {variant === "error" && (
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles[variant]}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p
              className={`text-sm font-semibold ${
                variant === "error"
                  ? "text-red-900"
                  : variant === "success"
                  ? "text-green-900"
                  : "text-[#111827]"
              }`}
            >
              {title}
            </p>
          )}
          {description && (
            <p
              className={`text-sm mt-1 ${
                variant === "error"
                  ? "text-red-700"
                  : variant === "success"
                  ? "text-green-700"
                  : "text-[#6B7280]"
              }`}
            >
              {description}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${
            variant === "error"
              ? "text-red-600"
              : variant === "success"
              ? "text-green-600"
              : "text-[#6B7280]"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Add keyframes to global styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
