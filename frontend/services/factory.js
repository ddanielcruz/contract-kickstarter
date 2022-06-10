import web3 from './web3'
import CampaignFactory from '../../ethereum/build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xebCd09888448445746897aE52dCb074EAb5075Fe'
)

export default instance
