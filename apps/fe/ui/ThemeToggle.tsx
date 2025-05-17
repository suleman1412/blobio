"use client"
import { useTheme } from ".././context/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    return (
        <div className="w-14 h-7 bg-card rounded-full relative cursor-pointer" onClick={toggleTheme}>
            <div className={`absolute w-6 h-6 text-foreground rounded-full bg-popover transition-all duration-300 ease-in-out ${theme === 'light' ? 'translate-x-1' : 'translate-x-7'} top-1/2 -translate-y-1/2`}>
                <div className="relative w-full h-full scale-75">
                    {theme === 'light' ?
                        <Moon className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
                        :
                        <Sun className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />}
                </div>
            </div>
        </div>
    )
}