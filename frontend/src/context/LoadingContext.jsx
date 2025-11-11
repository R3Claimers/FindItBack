import React, { createContext, useContext, useState } from "react";
import { Loader2 } from "lucide-react";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const showLoading = (message = "Processing...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage("");
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl shadow-2xl border border-border flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-foreground font-medium text-center">
              {loadingMessage}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Please wait and don't close this window
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
