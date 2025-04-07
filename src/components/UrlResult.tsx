import { Box, Text, Button, useClipboard, IconButton, Flex } from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const UrlResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasCopied, onCopy } = useClipboard(location.state?.shortenedUrl || '');

  const handleCopy = () => {
    onCopy();
  };

  const handleNewUrl = () => {
    navigate('/');
  };

  return (
    <Box p={6} borderWidth={1} borderRadius="xl" w="100%" textAlign="center">
      <Text fontWeight="bold" mb={4}>Your shortened URL:</Text>
      <Flex align="center" justify="center">
        <Text color="blue.500" wordBreak="break-all" mr={2}>
          {location.state?.shortenedUrl}
        </Text>
        <IconButton
          aria-label="Copy URL"
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          onClick={handleCopy}
          colorScheme={hasCopied ? 'green' : 'blue'}
          size="sm"
        />
      </Flex>
      <Button mt={4} onClick={handleNewUrl}>
        Shorten Another URL
      </Button>
    </Box>
  );
};

export default UrlResult; 