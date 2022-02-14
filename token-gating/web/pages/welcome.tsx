/* eslint-disable camelcase */
import { Box, Flex, Grid, Spinner } from '@chakra-ui/react'
import Layout from '@components/Layout'
import AddNewProject from '@components/AddNewProject'

import { useLazyQuery } from '@apollo/client'
import { GET_PROJECTS } from '@graphql/queries/projects'
import { GetProjects, GetProjects_projects_edges } from '../types/GetProjects'
import { useEffect } from 'react'
import ProjectCard from '@components/ProjectCard'

export const Welcome = () => {
  const [getProjects, { data, loading }] = useLazyQuery<GetProjects>(GET_PROJECTS)

  useEffect(() => {
    getProjects()
  }, [getProjects])

  if (loading) {
    return (
      <Layout title="">
        <Grid h="100vh" w="full" mt="100px" justifyContent="center">
          <Spinner />
        </Grid>
      </Layout>
    )
  }

  if (data) {
    return (
      <Layout title="">
        <AddNewProject onComplete={getProjects} />
        <Flex
          w="full"
          h="full"
          css={{
            gap: '40px',
          }}
          pt="50px"
          justifyContent="start"
          wrap="wrap"
        >
          {data?.projects.edges
            .map(({ node }: GetProjects_projects_edges) => (
              <ProjectCard
                key={node.id}
                id={node.id}
                name={node.name}
                description={node.description || ''}
                address={node.contractAddress}
                refetch={getProjects}
              />
            ))
            .reverse()}
        </Flex>
      </Layout>
    )
  }

  return null
}

export default Welcome
