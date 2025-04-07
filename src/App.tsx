import React from 'react'
import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UrlShortener from './components/UrlShortener'
import UrlResult from './components/UrlResult'
import Footer from './components/Footer'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
        },
      },
    },
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box flex="1" display="flex" flexDirection="column">
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/result" element={<UrlResult />} />
          </Routes>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App 