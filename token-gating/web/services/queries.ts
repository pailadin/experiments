import axios from 'axios'
import cookie from 'js-cookie'

type ChannelType = {
  icon: string
  id: string
  name: string
  owner: boolean
  permission: string
}

export type CollectionType = {
  collection: {
    // eslint-disable-next-line camelcase
    banner_image_url: string
  }
}

axios.defaults.headers.common = { Authorization: `Bearer ${cookie.get('discord_token')}` }

export default {
  getMe: () => async () => {
    const result = await axios.get<{}>(`${process.env.NEXT_PUBLIC_DISCORD_URI}users/@me`)
    return result.data
  },
  getChannels: () => async () => {
    const result = await axios.get<ChannelType[]>(`${process.env.NEXT_PUBLIC_DISCORD_URI}users/@me/guilds`)
    return result.data
  },
  getCollectionInfo: (collectionAddress: string) => async () => {
    const result = await axios.get<CollectionType>(`https://api.opensea.io/api/v1/asset_contract/${collectionAddress}`)
    return result.data
  },
}
