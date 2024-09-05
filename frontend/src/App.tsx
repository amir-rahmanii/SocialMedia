import React, { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import { QueryClient, QueryClientProvider } from 'react-query'
import Toast from './Components/Toast/Toast'
import AuthContextProvider from './Context/AuthContext'

function App() {

  const route = useRoutes(routes)


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
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [])


  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        {route}
        {/* show toast */}
        <Toast />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

export default App
