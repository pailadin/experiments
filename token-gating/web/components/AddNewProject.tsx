/* eslint-disable camelcase */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  chakra,
  Select,
} from '@chakra-ui/react'
import { FC } from 'react'
import { useAddNewProjectModal, AddNewProjectModal } from '@store/userStore'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { CREATE_PROJECT } from '@graphql/mutations/project'
import { CreateProjectVariables, CreateProject } from '../types/CreateProject'
import cookie from 'js-cookie'
import { useQuery } from 'react-query'
import getQueries from '@services/queries'

interface AddNewProjectProps {
  onComplete: () => void
}

const AddNewProject: FC<AddNewProjectProps> = ({ onComplete }) => {
  const discordToken = cookie.get('discord_token')
  const [addProject] = useMutation<CreateProject, CreateProjectVariables>(CREATE_PROJECT, {
    onCompleted: () => {
      onComplete()
      setShow(false)
    },
  })
  const [setShow, show] = useAddNewProjectModal((state: AddNewProjectModal) => [state.setShow, state.show])
  const { isOpen } = useDisclosure({
    isOpen: show,
  })

  const { data: channels } = useQuery(`get-discord-@me-channels-${discordToken}`, getQueries.getChannels(), {
    enabled: !!discordToken,
  })

  const { register, handleSubmit, formState } = useForm()
  const { isSubmitting } = formState
  const onSubmit = async (data) => {
    if (discordToken && data) {
      await addProject({
        variables: {
          request: {
            ...data,
            discordBotAccessToken: discordToken,
            discordId: '123',
          },
        },
      })
    }
  }

  const onClose = () => setShow(false)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pt="50px">
            <chakra.form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb="10px">
                <Input
                  id="name"
                  type="text"
                  size="sm"
                  placeholder="Project name"
                  {...register('name')}
                  textColor="gray.700"
                />
              </FormControl>
              <FormControl mb="10px">
                <Input
                  id="decription"
                  type="text"
                  size="sm"
                  placeholder="Description"
                  {...register('description')}
                  textColor="gray.700"
                />
              </FormControl>
              <FormControl mb="10px">
                <Input
                  id="address"
                  type="text"
                  size="sm"
                  placeholder="Collection Contract Address"
                  {...register('contractAddress')}
                  textColor="gray.700"
                />
              </FormControl>
              <FormControl mb="10px">
                <Select id="channel" type="text" size="sm" {...register('discordChannel')}>
                  {channels?.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                colorScheme="white"
                color="gray.700"
                border="2px solid gray"
                mr={3}
                isLoading={isSubmitting}
                w="full"
                mt="15px"
                mb="20px"
              >
                Submit
              </Button>
            </chakra.form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddNewProject
