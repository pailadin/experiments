import cookie from 'cookie'

export const addToServerCookie = (token: string) => [
  'Set-Cookie',
  cookie.serialize('token', token, {
    sameSite: 'strict',
    path: '/',
  }),
]
