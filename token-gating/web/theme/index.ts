/**
 * Strictly follow chakra-ui's recommendation on how to organize customized theme
 * for your project. https://chakra-ui.com/docs/theming/customize-theme#scaling-out-your-project
 */
import { extendTheme } from '@chakra-ui/react'
import '@fontsource/poppins'

export default extendTheme({
  styles: {
    global: {
      '*': {
        fontFamily: 'Poppins',
      },
      '.bn-onboard-modal': {
        zIndex: '10',
      },
    },
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
})
