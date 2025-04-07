import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider, Box } from '@chakra-ui/react'
import UrlShortener from './components/UrlShortener'
import Footer from './components/Footer'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Box flex="1">
            <Routes>
              <Route path="/" element={<UrlShortener />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App 