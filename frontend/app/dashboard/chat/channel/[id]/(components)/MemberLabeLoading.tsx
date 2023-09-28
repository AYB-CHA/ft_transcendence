import React from "react";

export default function MemberLabeLoading() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <div className="h-10 w-10 bg-dark-semi-dim rounded-full animate-pulse"></div>
        </div>
        <div>
          <div className="bg-dark-semi-dim h-3 animate-pulse w-20 mt-1"></div>
          <div className="bg-dark-semi-dim h-2 animate-pulse w-16 mt-2"></div>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <div className="bg-dark-semi-dim h-2 animate-pulse w-16 mt-2"></div>
        </div>
      </div>
    </div>
  );
}
