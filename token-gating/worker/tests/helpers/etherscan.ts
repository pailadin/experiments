import axios from 'axios';
import delay from '@highoutput/delay';
import { EtherScanObject } from '../../types';

export async function getEtherScanData(
  params: {
    contractAddress: string,
    apikey: string,
    blockSize?: number | null,
    startBlock?: string | null,
    endBlock?: string | null,
},
):Promise<EtherScanObject> {
  const etherScanResponse = await axios.post('https://api.etherscan.io/api', {}, {
    params: {
      module: 'account',
      action: 'tokennfttx',
      contractaddress: params.contractAddress,
      page: 1,
      offset: params.blockSize ? params.blockSize : 10000,
      startblock: params.startBlock,
      endblock: params.endBlock,
      sort: 'desc',
      apikey: params.apikey,
    },
  });

  const etherScanData = etherScanResponse.data;

  if (!etherScanData) { throw new Error('EtherScan Failed'); }

  await delay(100);

  return etherScanData;
}
