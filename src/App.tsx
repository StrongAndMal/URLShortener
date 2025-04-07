import { ChakraProvider, Container, Box, Heading, Text, VStack, Image, useColorMode, IconButton, Flex } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { theme } from './theme'
import UrlShortener from './components/UrlShortener'
import Footer from './components/Footer'

function App() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" display="flex" flexDirection="column" 
           bgGradient={colorMode === 'dark' 
             ? 'linear(to-b, gray.900, gray.800)' 
             : 'linear(to-b, blue.50, gray.50)'}>
        
        <Flex justifyContent="flex-end" p={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
          />
        </Flex>
        
        <Container maxW="container.md" centerContent flex="1" py={8}>
          <VStack spacing={8} align="stretch" w="full">
            <VStack spacing={3} textAlign="center" mb={4}>
              <Heading 
                as="h1" 
                size="2xl" 
                bgGradient="linear(to-r, teal.500, blue.500)" 
                bgClip="text"
                fontWeight="extrabold"
              >
                URL Shortener
              </Heading>
              <Text 
                fontSize="lg" 
                color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
              >
                Create short and memorable links in seconds
              </Text>
            </VStack>
            
            <Box 
              borderRadius="lg" 
              bg={colorMode === 'dark' ? 'gray.700' : 'white'} 
              p={6} 
              boxShadow="xl"
              borderWidth="1px"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
            >
              <UrlShortener />
            </Box>
            
            <Box 
              borderRadius="lg" 
              bg={colorMode === 'dark' ? 'gray.700' : 'white'} 
              p={6} 
              boxShadow="md"
              borderWidth="1px"
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
            >
              <VStack align="start" spacing={4}>
                <Heading size="md" color={colorMode === 'dark' ? 'teal.300' : 'teal.600'}>
                  Why use our URL shortener?
                </Heading>
                <VStack align="start" spacing={2}>
                  <Text>✓ Fast and reliable - create short links instantly</Text>
                  <Text>✓ Simple to use - no registration required</Text>
                  <Text>✓ Secure - your data is safe with us</Text>
                  <Text>✓ Free - use as many times as you need</Text>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Container>
        
        <Footer />
      </Box>
    </ChakraProvider>
  )
}

export default App 