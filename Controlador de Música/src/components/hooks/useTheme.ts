import { useState, useEffect } from 'react'

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(true)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    return { isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode) }
}