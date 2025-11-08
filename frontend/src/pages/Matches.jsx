import React from "react";
import { Compass } from "lucide-react";

const Matches = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <Compass className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Smart Matches
        </h2>
        <p className="text-muted-foreground">
          This page is under development. You'll see AI-powered matches between
          lost and found items here.
        </p>
      </div>
    </div>
  );
};

export default Matches;
