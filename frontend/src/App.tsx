import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import { QueryClient, QueryClientProvider } from 'react-query'
import Toast from './Components/Toast/Toast'

function App() {

  const route = useRoutes(routes)

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 7000,
      },
    },
  });


  return (
    <QueryClientProvider client={client}>
      {route}
      {/* show toast */}
      <Toast />
    </QueryClientProvider>
  )
}

export default App
