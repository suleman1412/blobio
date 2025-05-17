import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode
    className?: string
}

export default function Button({ children, className } : ButtonProps ){
    return(
        <button className={cn(
            "w-full py-3 px-6 bg-card text-foreground  hover:bg-cardHover rounded-lg transform transition-all hover:scale-105 active:scale-95 border-2 border-border cursor-pointer",
            className
        )}>
            { children }
        </button>
    )
}