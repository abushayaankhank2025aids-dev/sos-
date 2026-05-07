import { FC } from "react";
import logoImg from "../../imports/unnamed.png";

export const ArsLogo: FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <img 
    src={logoImg} 
    alt="ARS Logo" 
    className={`${className} object-contain`} 
  />
);
