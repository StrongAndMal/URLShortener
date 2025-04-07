import { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  useClipboard,
  Flex,
  Heading,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon, LinkIcon } from '@chakra-ui/icons';
import { shortenUrl } from '../services/api';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(shortUrl);

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.800');
  
  const isValidUrl = (urlString: string) => {
    try {
      const formatted = urlString.trim();
      if (!formatted) return false;
      
      // Add protocol if missing
      const urlWithProtocol = formatted.match(/^https?:\/\//i) 
        ? formatted 
        : `http://${formatted}`;
        
      new URL(urlWithProtocol);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleShortenUrl = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await shortenUrl(url);
      setShortUrl(result);
      toast({
        title: 'URL shortened successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to shorten URL',
        status: 'error',
        duration: 5000,
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
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleShortenUrl();
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="100%">
      <Heading size="md" mb={1}>Shorten your URL</Heading>
      
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor="url">Enter a long URL</FormLabel>
        <InputGroup size="lg">
          <Input
            id="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            bg={inputBg}
            borderWidth="1px"
            borderColor={borderColor}
            focusBorderColor="teal.400"
            _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal.400' }}
          />
          <InputRightElement width="4.5rem">
            <LinkIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
      
      <Button
        colorScheme="teal"
        size="lg"
        isLoading={isLoading}
        loadingText="Shortening..."
        onClick={handleShortenUrl}
        isDisabled={!url.trim()}
        w="100%"
        mb={4}
      >
        Shorten URL
      </Button>
      
      {shortUrl && (
        <>
          <Divider my={2} />
          
          <Box>
            <Text fontWeight="bold" mb={2}>Your shortened URL:</Text>
            <Flex 
              p={3} 
              borderRadius="md" 
              bg={inputBg} 
              borderWidth="1px"
              borderColor={borderColor}
              alignItems="center"
            >
              <Text flex="1" fontWeight="medium" isTruncated>
                {shortUrl}
              </Text>
              <Button
                ml={2}
                colorScheme={hasCopied ? 'green' : 'gray'}
                onClick={handleCopy}
                size="sm"
                leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              >
                {hasCopied ? 'Copied' : 'Copy'}
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </VStack>
  );
};

export default UrlShortener; 