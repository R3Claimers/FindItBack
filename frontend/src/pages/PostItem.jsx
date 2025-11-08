import React from "react";
import { PlusCircle } from "lucide-react";

const PostItem = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <PlusCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Post Item</h2>
        <p className="text-muted-foreground">
          This page is under development. You'll be able to post lost or found
          items here.
        </p>
      </div>
    </div>
  );
};

export default PostItem;
