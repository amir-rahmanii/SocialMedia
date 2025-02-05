import { createContext, useContext, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// ایجاد context برای تم
const ThemeContext = createContext<{ toggleTheme: () => void; themeMode: 'light' | 'dark' }>({
    toggleTheme: () => {},
    themeMode: 'light',
});

// تم‌های لایت و دارک
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ffffff',
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000000',
        },
    },
});

// فراهم کردن context برای کل اپلیکیشن
export const ThemeProviderContext = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
    );

    // تابع تغییر تم
    const toggleTheme = () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const theme = themeMode === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
