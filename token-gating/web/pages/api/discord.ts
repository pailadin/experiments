/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */

import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import { toQueryParams } from '@utils/objecToQueryParams'

const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

type Response = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
  error?: string
}

type Error = {
  error: string
  error_description: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  const params = new URLSearchParams()
  params.append('client_id', process.env.CLIENT_ID)
  params.append('client_secret', process.env.CLIENT_SECRET)
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('redirect_uri', process.env.REDIRECT_URI)

  await fetch(process.env.API_ENDPOINT, {
    method: 'post',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
  })
    .then((staleRes) => staleRes.json())
    .then((response: Response) => {
      if (!response.error) {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('discord_token', response.access_token, {
            sameSite: 'strict',
            path: '/',
          })
        )
      }
      res.redirect(`/welcome?${toQueryParams(response)}`)
    })
    .catch((error: Error) => {
      res.status(404).json(error)
    })
}
