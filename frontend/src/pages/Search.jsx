import React from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <SearchIcon className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Search Page</h2>
        <p className="text-muted-foreground">
          This page is under development. You'll be able to search for lost and
          found items here.
        </p>
      </div>
    </div>
  );
};

export default Search;
