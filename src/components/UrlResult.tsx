import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useClipboard,
  IconButton,
  Flex,
  Heading,
  Container,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { simplecopy } from '../utils/simplecopy';

const UrlResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const shortenedUrl = location.state?.shortenedUrl;
  const { hasCopied, onCopy } = useClipboard(shortenedUrl);

  if (!shortenedUrl) {
    navigate('/');
    return null;
  }

  const handleCopy = () => {
    // Try Chakra UI's clipboard first
    onCopy();
    
    // If that fails, try simplecopy as fallback
    if (!hasCopied) {
      const success = simplecopy(shortenedUrl);
      if (success) {
        toast({
          title: 'Copied to clipboard!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to copy',
          description: 'Please try copying manually',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
          🎉 URL Shortened Successfully!
        </Heading>
        
        <Box
          p={8}
          borderWidth={1}
          borderRadius="xl"
          w="100%"
          textAlign="center"
          bg="white"
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <Text fontSize="lg" color="gray.600">
              Your shortened URL is ready to use! 🚀
            </Text>
            
            <Box
              p={4}
              borderWidth={1}
              borderRadius="lg"
              w="100%"
              bg="gray.50"
            >
              <Flex align="center" justify="center">
                <Text 
                  color="blue.500" 
                  wordBreak="break-all" 
                  mr={2}
                  fontSize="lg"
                >
                  {shortenedUrl}
                </Text>
                <IconButton
                  aria-label="Copy URL"
                  icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                  onClick={handleCopy}
                  colorScheme={hasCopied ? 'green' : 'blue'}
                  size="sm"
                />
              </Flex>
              {hasCopied && (
                <Text color="green.500" mt={2} fontSize="sm">
                  Copied to clipboard! 📋
                </Text>
              )}
            </Box>

            <Text fontSize="sm" color="gray.500">
              Copy this URL and paste it in your browser to visit the original website 🌐
            </Text>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Shorten Another URL ✂️
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default UrlResult; 