import { Box, Center, useColorModeValue, Heading, Text, Stack, Image, Fade, Grid, Spinner } from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { DELETE_PROJECT } from '@graphql/mutations/project'
import { DeleteProjectVariables, DeleteProject } from '../types/DeleteProject'
import { useCollectionDetail } from '@hooks/useGetCollectionDetail'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'

// const IMAGE =
//   'https://lh3.googleusercontent.com/U584T8SUu66g60cVtv3z7k-q7UJNKoIRjZISmxo6AewpGl3pNN9uk3ZB804qoNPhvqVVYR5ecA5AiUJ2RYvMYyg6GWWg-jtNSsa1eg=s2500'

interface ProjectCardProps {
  id: string
  name: string
  description: string
  address: string
  refetch: () => void
}

export const ProjectCard: FC<ProjectCardProps> = ({ id, name, description, address, refetch }) => {
  const { data, isLoading } = useCollectionDetail(address)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [deleteProject] = useMutation<DeleteProject, DeleteProjectVariables>(DELETE_PROJECT, {
    onCompleted: () => {
      refetch()
      setIsDeleting(true)
    },
  })

  const router = useRouter()

  const onDelete = async () => {
    setIsDeleting(true)
    await deleteProject({
      variables: {
        request: {
          id,
        },
      },
    })
  }
  return (
    <Fade in>
      <Center
        py={12}
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/invite/${id}`)
        }}
      >
        <Box
          role={'group'}
          p={6}
          w={'330px'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'md'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}
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
              <Box>
                {isDeleting && (
                  <Box borderRadius="6px" pos="absolute" bg="black" opacity={0.8} h="full" w="full" zIndex={10}>
                    <Grid placeItems="center" h="full">
                      <Spinner color="red" size="xl" />
                    </Grid>
                  </Box>
                )}

                <Box
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  bg="red"
                  pos="absolute"
                  right="-6px"
                  top="-6px"
                  borderRadius="full"
                  px="6px"
                  py="-2px"
                  fontSize="xs"
                  textColor="white"
                  fontWeight="bold"
                  visibility="hidden"
                  zIndex={12}
                  _groupHover={{
                    visibility: 'visible',
                  }}
                >
                  x
                </Box>
                <Image
                  shadow={'xl'}
                  rounded={'lg'}
                  height={230}
                  width={282}
                  objectFit={'cover'}
                  src={data?.collection.banner_image_url}
                  fallbackSrc={'/placeholder.png'}
                />
              </Box>
            )}
          </Box>
          <Stack pt={7} align={'center'}>
            <Heading fontSize={'18px'} fontWeight={600} isTruncated noOfLines={2}>
              {name}
            </Heading>
            <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
              {description}
            </Text>
            <Stack direction={'row'} align={'center'}>
              <Text fontWeight={800} fontSize={'xl'}></Text>
            </Stack>
          </Stack>
        </Box>
      </Center>
    </Fade>
  )
}

export default ProjectCard
