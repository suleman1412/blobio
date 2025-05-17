"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

export interface ThemeToggleProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    mnemonics?: string;
    setMnemonics?: Dispatch<SetStateAction<string>>
}


const ThemeContext = createContext<ThemeToggleProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeToggleProps['theme']>('light')

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    useEffect(() => {
        document.querySelector('html')?.classList.remove('light', 'dark')
        document.querySelector('html')?.classList.add(theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
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