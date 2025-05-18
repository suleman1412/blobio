"use client"
import { useGameStore } from "@/store/store";
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react";

export interface ThemeToggleProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    BGMRef: RefObject<HTMLAudioElement | null>
}


const ThemeContext = createContext<ThemeToggleProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeToggleProps['theme']>('light')
    const BGMRef = useRef<HTMLAudioElement | null>(null)
    const serverConnectionMade = useGameStore((state) => state.serverConnectionMade)
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }
    useEffect(() => {
        const audio = new Audio("/sounds/BGM3.mp3");
        audio.loop = true;
        audio.currentTime = 0;
        audio.volume = 0.1;

        BGMRef.current = audio;

        return () => {
            if (BGMRef.current) {
                BGMRef.current.pause();
                BGMRef.current.currentTime = 0;
            }
        };
    }, []);
    useEffect(() => {
        document.querySelector('html')?.classList.remove('light', 'dark')
        document.querySelector('html')?.classList.add(theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, BGMRef }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a provider")
    }
    return context
}