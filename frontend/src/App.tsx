import React, { useContext, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import { QueryClient, QueryClientProvider } from 'react-query'
import Toast from './Components/Toast/Toast'
import AuthContextProvider, { AuthContext } from './Context/AuthContext'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProviderContext } from './Context/ThemeContext'
import apiRequest from './Services/axios'


function App() {

  const route = useRoutes(routes);



  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: true,
        // retry: 1,
      },
      // mutations: {
      //   retry: 0,
      // }
    }
  });

  //change theme
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme !== 'dark');
  }, [])



  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <ThemeProviderContext>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {route}
            {/* show toast */}
            <Toast />
          </LocalizationProvider>
        </ThemeProviderContext>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

export default App
