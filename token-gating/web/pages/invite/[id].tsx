/* eslint-disable camelcase */
import { Box, Grid, Image, Flex, Spinner, Center, Heading, Text, Stack, Fade, Button } from '@chakra-ui/react'
import { useCollectionDetail } from '@hooks/useGetCollectionDetail'
import client from '@graphql/apolloClient'
import { GET_PROJECTS } from '@graphql/queries/projects'
import { GetProjects, GetProjects_projects_edges } from '../../types/GetProjects'
import { FC } from 'react'

interface InviteProps {
  projectData: GetProjects_projects_edges
}

export const Invite: FC<InviteProps> = ({ projectData }) => {
  const { data, isLoading } = useCollectionDetail(projectData.node.contractAddress)

  if (isLoading) {
    return (
      <Grid h="100vh" w="full" placeItems="center">
        <Spinner />
      </Grid>
    )
  }

  return (
    <Flex h="100vh" w="full" flexDir="column" justifyContent="center" alignItems="center" bg="gray.100">
      <Heading mb="20px">Grab your access now 🔥 </Heading>
      <Fade in>
        <Center py={8}>
          <Box
            role={'group'}
            p={6}
            minW={'330px'}
            w={'full'}
            boxShadow={'md'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}
            bg="white"
          >
            <Box
              rounded={'lg'}
              mt={-12}
              pos={'relative'}
              height={'230px'}
              _after={{
                transition: 'all .3s ease',
                content: '""',
                w: 'full',
                h: 'full',
                pos: 'absolute',
                top: 1,
                left: 0,
                backgroundImage: `url(${data?.collection.banner_image_url})`,
                filter: 'blur(15px)',
                zIndex: -1,
              }}
              _groupHover={{
                cursor: 'pointer',
                _after: {
                  filter: 'blur(20px)',
                },
              }}
            >
              {!isLoading && (
                <Image
                  shadow={'xl'}
                  rounded={'lg'}
                  height={230}
                  width={282}
                  objectFit={'cover'}
                  src={data?.collection.banner_image_url}
                  fallbackSrc={'/placeholder.png'}
                />
              )}
            </Box>
            <Stack pt={7} align={'center'}>
              <Heading fontSize={'24px'} fontWeight={600}>
                {projectData.node.name}
              </Heading>
              <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                {projectData.node.description}
              </Text>
              <Stack direction={'row'} align={'center'}>
                <Text fontWeight={800} fontSize={'xl'}></Text>
              </Stack>
            </Stack>
          </Box>
        </Center>
      </Fade>
      <Flex flexDir="column" justifyContent="center" alignItems="center" mt="20px">
        <Flex>
          <Button variant="solid" colorScheme="blue" textColor="white" mr="10px">
            Discord
          </Button>
          <Button colorScheme="orange" textColor="white">
            Metamask
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Invite

export const getServerSideProps = async (context) => {
  const projectData = await client
    .query<GetProjects>({
      query: GET_PROJECTS,
    })
    .then((result) => result.data.projects.edges.find((project) => project.node.id === context.query.id))

  if (!projectData) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }
  return {
    props: {
      projectData: projectData || null,
    },
  }
}
