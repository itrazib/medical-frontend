import React from "react";

import useAuth from "../Hooks/UseAuth";
const Spinner = () => {
  const { user } = useAuth();
  const positionClasses = user ? "top-[85px] lg:top-[180px]" : "top-[100px]";
  return (
    <div
      className={`
        absolute 
        left-1/2 
        transform -translate-x-1/2 
        ${positionClasses} 
        z-50
      `}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600" />
    </div>
  );
};

export default Spinner;
