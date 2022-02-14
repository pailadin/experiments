import axios from 'axios';

export default async function (): Promise<string> {
  const response = await axios.post('https://discord.com/api/v6/auth/login', {
    login: 'lorddagzlaaw@gmail.com',
    password: 'lasaw321',
    undelete: false,
    captcha_key: null,
    login_source: null,
    gift_code_sku_id: null,
  });

  if (!response.data) { throw new Error('Unable to login user'); }

  const userToken = response.data.token;

  const botAppResponse = await axios.get('https://discord.com/api/v9/applications/941156706908508220', {
    headers: {
      Authorization: userToken,
    },
  });

  if (!botAppResponse.data) {
    throw new Error('Unable to get bot token');
  }

  return botAppResponse.data.bot.token;
}
