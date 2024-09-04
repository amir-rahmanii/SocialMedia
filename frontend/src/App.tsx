import React from 'react'
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
