import { Box, Container, Flex, Heading, Icon, IconButton, Button, Text } from '@chakra-ui/react'
import AppSidebar from '@components/AppSidebar'
import MetaTags from '@components/MetaTags'
import { LogoutIcon } from '@heroicons/react/solid'
import { FC, useEffect, useState } from 'react'
import ConnectDiscord from '@components/ConnectDiscord'
import Onboard from 'bnc-onboard'
import { useAddNewProjectModal, AddNewProjectModal } from '@store/userStore'

interface LayoutProps {
  title: string
}

type onBoard = () => void

const Layout: FC<LayoutProps> = ({ children, title }) => {
  const setShow = useAddNewProjectModal((state: AddNewProjectModal) => state.setShow)
  const [isCollapsed, setIsCollpased] = useState(true)
  const [address, setAddress] = useState<string>('')
  const [onboard, setOnboard] = useState<onBoard | null>(null)

  useEffect(() => {
    const onbrd = Onboard({
      dappId: process.env.BLOCK_NATIVE,
      networkId: 4,
      subscriptions: {
        address: setAddress,
      },
      walletSelect: {
        wallets: [{ walletName: 'metamask' }],
      },
      walletCheck: [{ checkName: 'connect' }, { checkName: 'accounts' }],
    })
    setOnboard(onbrd)
  }, [])

  const walletInit = async () => {
    if (onboard) {
      await onboard.walletSelect()
      await onboard.walletCheck()
    }
  }
  return (
    <Flex>
      <MetaTags title={title} />
      <AppSidebar isCollapsed={isCollapsed} />
      <Box w="full" pl={isCollapsed ? 14 : 52}>
        <Flex
          px={4}
          position="sticky"
          top="0"
          h="64px"
          alignItems="center"
          borderBottom="1px solid #E5E7EB"
          bg="white"
          zIndex={3}
          justifyContent="space-between"
        >
          <Flex>
            <IconButton
              mr={4}
              transform="scaleX(-1)"
              {...(isCollapsed && {
                transform: 'scaleX(1)',
              })}
              color="gray.400"
              size="xs"
              variant="unstyled"
              aria-label="toggle collapse"
              icon={<Icon fontSize={16} as={LogoutIcon} />}
              onClick={() => setIsCollpased((v) => !v)}
            />
            <Heading as="h2" fontSize="xl" mb={0}>
              {title}
            </Heading>
          </Flex>
          <Flex
            css={{
              gap: '20px',
            }}
          >
            <Button
              onClick={() => setShow(true)}
              ml="10px"
              variant="solid"
              color="gray.600"
              _hover={{
                cursor: 'pointer',
                bg: 'white',
              }}
              _active={{
                cursor: 'pointer',
                bg: 'white',
              }}
              bg="white"
            >
              New Project
            </Button>
            <Button
              borderBottom={`2px solid ${address ? 'orange' : 'gray'}`}
              borderLeft={`2px solid ${address ? 'orange' : 'gray'}`}
              onClick={walletInit}
              ml="10px"
              variant="solid"
              color="gray.600"
              bg="white"
              shadow="md"
              _hover={{
                cursor: 'pointer',
              }}
              _active={{
                bg: 'white',
              }}
            >
              Metamask
            </Button>
            <ConnectDiscord />
          </Flex>
        </Flex>
        <Container w="full" maxW="container.xl">
          {children}
        </Container>
      </Box>
    </Flex>
  )
}

export default Layout
