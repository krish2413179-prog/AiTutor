import React from 'react';
  
  const Utils = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default Utils;
  import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
