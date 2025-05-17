import { ReactNode } from "react";

export default function Modal({ children } : { children: ReactNode }){
    return( 
        <div className="flex flex-col items-center justify-center bg-ring backdrop-blur-sm py-8 px-12 rounded-xl border-2 border-border shadow-2xl">
            { children }
        </div>
    )
}