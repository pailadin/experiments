import { Avatar, Button, Flex, Heading, Menu, MenuButton, MenuList, Text, VStack } from '@chakra-ui/react'
import { ChevronUpIcon } from '@heroicons/react/outline'
import { LogoutIcon } from '@heroicons/react/solid'
import { logout } from '@utils/authUtils'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { FC } from 'react'
import MenuItem from './MenuItem'

interface AppSidebarProps {
  isCollapsed?: boolean
}

const AppSidebar: FC<AppSidebarProps> = ({ isCollapsed = false }) => {
  const profile = JSON.parse(Cookies.get('google_profile') || '{}')
  const stackSpacing = isCollapsed ? 4 : 1
  return (
    <Flex pos="fixed" w={isCollapsed ? 14 : 52} bg="#F9F9F9" h="100vh" flexDir="column" justifyContent="space-between">
      <Flex flexDir="column">
        <Flex
          p="24px 16px 16px"
          alignItems="center"
          {...(isCollapsed && { justifyContent: 'center' })}
          borderBottom="1px solid #E5E7EB"
        >
          <Link href={{ pathname: '/' }}>
            <Avatar src="/logo.png" name={process.env.appName} size="xs" borderRadius="md" cursor="pointer" />
          </Link>
          {!isCollapsed && (
            <Heading ml="6px" as="h4" fontSize={12} mb={0}>
              {process.env.appName}
            </Heading>
          )}
        </Flex>
        <VStack px={2} mt={3} spacing={stackSpacing} alignItems="start">
          {/* <MenuItem
            shortCutKeys={['Ctrl', 'K']}
            icon={SearchIcon}
            label="Search"
            isCollapsed={isCollapsed}
            onClick={() => {}}
          /> */}
          {/* <MenuItem icon={UserIcon} label="Menu item 1" isCollapsed={isCollapsed} />
          <MenuItem icon={UserIcon} label="Menu item 2" isCollapsed={isCollapsed} />
          <MenuItem icon={UserIcon} label="Menu item 3" isCollapsed={isCollapsed} /> */}
        </VStack>
      </Flex>
      <Flex px={2} pb={12} flexDir="column">
        {/* <MenuItem icon={UserIcon} label="Menu item 4" isCollapsed={isCollapsed} /> */}
        <Menu id="user-menu" matchWidth>
          <MenuButton
            w="full"
            as={Button}
            variant="ghost"
            p={1}
            mt={4}
            _hover={{ background: 'rgba(0, 0, 0, 0.04)' }}
            {...(!isCollapsed && {
              rightIcon: <ChevronUpIcon />,
            })}
          >
            <Flex
              alignItems="center"
              {...(isCollapsed && {
                justifyContent: 'center',
              })}
            >
              <Avatar
                size={isCollapsed ? 'xs' : 'sm'}
                borderRadius="md"
                name={process.env.appName}
                src={profile.imageUrl || '/logo.png'}
              />
              {!isCollapsed && (
                <Flex flexDir="column" ml={2} alignItems="start">
                  <Heading maxW="124px" as="h4" size="xs" mb={0} isTruncated>
                    {profile.name || ''}
                  </Heading>
                  <Text
                    maxW="124px"
                    lineHeight="shorter"
                    fontWeight="thin"
                    fontSize="smaller"
                    color="gray.800"
                    isTruncated
                  >
                    {profile.email || ''}
                  </Text>
                </Flex>
              )}
            </Flex>
          </MenuButton>
          <MenuList mb={3} p={2} minW="175px">
            <VStack spacing={1} alignItems="start">
              {/* <MenuItem icon={UserIcon} label="Menu item 5" />
              <MenuItem icon={UserIcon} label="Menu item 6" /> */}
              <MenuItem icon={LogoutIcon} label="Logout" onClick={logout} />
            </VStack>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default AppSidebar
