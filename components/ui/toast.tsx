"use client";

import * as React from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

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
    default: "bg-card border-border text-card-foreground shadow-lg shadow-black/5 dark:shadow-black/20",
    success: "bg-emerald-500/10 border-emerald-500/30 text-foreground dark:bg-emerald-950/40 dark:border-emerald-500/30 shadow-lg",
    error: "bg-destructive/10 border-destructive/30 text-foreground dark:bg-destructive/20 dark:border-destructive/30 shadow-lg",
  };

  const iconStyles = {
    default: "text-violet-500",
    success: "text-emerald-500",
    error: "text-destructive",
  };

  return (
    <div
      className={`pointer-events-auto transform transition-all duration-300 ease-out ${
        isExiting
          ? "translate-y-0 opacity-0 scale-95"
          : "translate-y-0 opacity-100 scale-100 animate-slide-in"
      }`}
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${variantStyles[variant]}`}
      >
        {variant === "default" && (
          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles.default}`} />
        )}
        {variant === "success" && (
          <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles.success}`} />
        )}
        {variant === "error" && (
          <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles.error}`} />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold text-foreground">
              {title}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
