import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#00bcd4',
    600: '#00acc1',
    700: '#0097a7',
    800: '#00838f',
    900: '#006064',
  },
}

const fonts = {
  heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
}

const styles = {
  global: (props: any) => ({
    body: {
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
    },
  }),
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'md',
    },
    variants: {
      primary: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'teal.300' : 'teal.500',
        color: props.colorMode === 'dark' ? 'gray.800' : 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'teal.400' : 'teal.600',
        },
      }),
    },
  },
  Input: {
    variants: {
      filled: (props: any) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.500' : 'gray.200',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'gray.500' : 'gray.200',
          },
        },
      }),
    },
  },
}

export const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
}) 