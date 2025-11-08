import React from "react";
import { Package } from "lucide-react";

const FoundItemDetail = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <Package className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Found Item Details
        </h2>
        <p className="text-muted-foreground">This page is under development.</p>
      </div>
    </div>
  );
};

export default FoundItemDetail;
