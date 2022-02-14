import { Box, Grid, Flex, Image, Text, Button } from '@chakra-ui/react'

export const NewWelcome = () => {
  return (
    <Grid w="full" justifyContent="center" alignItems="center" h="screen">
      <Grid gridTemplateColumns="400px 600px" h="auto" borderRadius="6px" mt="100px" shadow="md">
        <Box bg="white" p="30px">
          <Grid gridTemplateColumns="2fr 3fr" gap="30px">
            <Flex flexDir="column" justifyContent="center" alignItems="center" css={{ gap: '30px' }}>
              <Image
                borderRadius="full"
                src="https://ipfs.pixura.io/ipfs/QmT2RYwURjasbAgMxykF9wPL6boo8xChpam5R2QXMGQdzE/CROWN_GIF.gif"
                w="100px"
                h="100px"
                shadow="md"
              />
              <Box>
                <Button bg="orange.400" textColor="white" w="full" mb="10px">
                  Metamask
                </Button>
                <Button bg="blue.400" textColor="white" w="full">
                  Discord
                </Button>
              </Box>
            </Flex>
            <Flex flexDir="column" css={{ gap: '30px' }}>
              <Box>
                <Text fontWeight="extrabold" fontSize="36px" lineHeight="1.1">
                  Clement Morin
                </Text>
                <Text fontWeight="semibold">@clementmorin</Text>
              </Box>
              <Box>
                <Text fontWeight="thin" fontSize="12px" textColor="gray.700">
                  PROJECTS
                </Text>
                <Text fontWeight="extrabold" fontSize="32px" lineHeight="1">
                  12
                </Text>
              </Box>
            </Flex>
          </Grid>
        </Box>
        <Box bg="white">es</Box>
      </Grid>
    </Grid>
  )
}

export default NewWelcome
