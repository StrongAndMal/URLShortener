import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightAddon,
  useClipboard,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { shortenUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(shortenedUrl);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const shortUrl = await shortenUrl(url);
      setShortenedUrl(shortUrl);
      navigate('/result', { state: { shortenedUrl: shortUrl } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later';
      setError(errorMessage);
      toast({
        title: '❌ Error shortening URL',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          🔗 URL Shortener
        </Heading>
        <Text fontSize="xl" textAlign="center" color="gray.600">
          Make your long URLs short and sweet ✨
        </Text>
        <Box 
          as="form" 
          onSubmit={handleSubmit} 
          w="100%" 
          bg="white" 
          p={8} 
          borderRadius="xl" 
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <InputGroup size="lg">
              <Input
                placeholder="Enter your long URL here 🌐"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                size="lg"
                required
                type="url"
                isInvalid={!!error}
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px blue.400',
                }}
              />
            </InputGroup>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isLoading}
              loadingText="Shortening..."
              w="100%"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Shorten URL ✂️
            </Button>
          </VStack>
        </Box>
        {shortenedUrl && (
          <Box
            p={6}
            borderWidth={1}
            borderRadius="xl"
            w="100%"
            textAlign="center"
            bg="white"
            boxShadow="md"
          >
            <Text fontWeight="bold" mb={2}>Your shortened URL:</Text>
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
        )}
      </VStack>
    </Container>
  );
};

export default UrlShortener; 