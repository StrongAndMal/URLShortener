import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  useClipboard,
  IconButton,
  Container,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { shortenUrl } from '../services/api';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(shortenedUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await shortenUrl(url);
      setShortenedUrl(result);
      toast({
        title: 'URL shortened successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'URL copied to clipboard!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
          URL Shortener
        </Heading>
        
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <InputGroup size="lg">
                <Input
                  placeholder="Enter your long URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  isInvalid={!!error}
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Shortening..."
                >
                  Shorten URL
                </Button>
              </InputGroup>
              
              {error && (
                <Text color="red.500">{error}</Text>
              )}
              
              {shortenedUrl && (
                <Flex align="center" justify="center">
                  <Text mr={2}>{shortenedUrl}</Text>
                  <IconButton
                    aria-label="Copy URL"
                    icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                    onClick={handleCopy}
                    colorScheme={hasCopied ? 'green' : 'blue'}
                  />
                </Flex>
              )}
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default UrlShortener; 