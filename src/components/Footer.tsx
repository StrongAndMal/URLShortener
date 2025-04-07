import { Box, Container, Flex, Text, Link, HStack, useColorModeValue, Icon } from '@chakra-ui/react';
import { FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const linkHoverColor = useColorModeValue('teal.500', 'teal.300');

  return (
    <Box as="footer" bg={bgColor} py={6} width="100%">
      <Container maxW="container.lg">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color={textColor} mb={{ base: 4, md: 0 }}>
            © {new Date().getFullYear()} URL Shortener. Built with ❤️ by StrongAndMal
          </Text>
          
          <HStack spacing={4}>
            <Link 
              href="https://github.com/StrongAndMal/URLShortener" 
              isExternal
              aria-label="GitHub"
              _hover={{ color: linkHoverColor }}
            >
              <Icon 
                as={FaGithub} 
                boxSize={5} 
                color={iconColor}
                _hover={{ color: linkHoverColor }} 
                transition="color 0.2s"
              />
            </Link>
            <Link 
              href="https://instagram.com/strongandmal" 
              isExternal
              aria-label="Instagram"
              _hover={{ color: linkHoverColor }}
            >
              <Icon 
                as={FaInstagram} 
                boxSize={5} 
                color={iconColor}
                _hover={{ color: linkHoverColor }} 
                transition="color 0.2s"
              />
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer; 