import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'

function App() {

  const route = useRoutes(routes)

  return (
    <div>
      {route}
    </div>
  )
}

export default App
