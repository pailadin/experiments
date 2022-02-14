import { Container, Flex, Grid, GridItem } from '@chakra-ui/react'
import { FC } from 'react'

const SignupLayout: FC = ({ children }) => (
  <Grid templateColumns={{ md: 'repeat(5, 1fr)' }} minH="100vh">
    <GridItem colSpan={{ md: 2 }} bg="papayawhip" />
    <GridItem colSpan={{ md: 3 }}>
      <Container h="full">
        <Flex h="full" alignItems="center">
          {children}
        </Flex>
      </Container>
    </GridItem>
  </Grid>
)

export default SignupLayout
