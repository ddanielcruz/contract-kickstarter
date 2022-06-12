import web3 from './web3'
import CampaignFactory from '../../ethereum/build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x589F28db9175cEA2028E132f45b5ddC0969356fa'
)

export default instance
