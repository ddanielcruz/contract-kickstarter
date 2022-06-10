const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const compiledFactory = require('../build/CampaignFactory.json')
const compiledCampaign = require('../build/Campaign.json')

const web3 = new Web3(ganache.provider({ gasLimit: 1e7 }))
let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: 1e7 })

  await factory.methods.createCampaign('100').send({ from: accounts[1], gas: 1e7 })

  campaignAddress = (await factory.methods.getDeployedCampaigns().call())[0]
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaign', () => {
  it('deploys a factory and a campaign', async () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('marks caller as campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(manager, accounts[1])
  })

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({ from: accounts[2], value: '200' })
    const approver = await campaign.methods.approvers(accounts[2]).call()
    const approversCount = await campaign.methods.approversCount().call()
    assert.ok(approver)
    assert.equal(approversCount, 1)
  })

  it('requires a minimum contribution', async () => {
    await assert.rejects(campaign.methods.contribute().send({ from: accounts[2] }))
    const approver = await campaign.methods.approvers(accounts[2]).call()
    const approversCount = await campaign.methods.approversCount().call()
    assert.equal(approver, false)
    assert.equal(approversCount, 0)
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('any-description', 100, accounts[3])
      .send({ from: accounts[1], gas: 1e6 })
    const request = await campaign.methods.requests(0).call()
    assert.equal(request.description, 'any-description')
    assert.equal(request.value, 100)
    assert.equal(request.recipient, accounts[3])
  })

  it('processes request', async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[2], value: web3.utils.toWei('10', 'ether') })
    await campaign.methods
      .createRequest('any-description', web3.utils.toWei('5', 'ether'), accounts[3])
      .send({ from: accounts[1], gas: 1e6 })
    await campaign.methods.approveRequest(0).send({ from: accounts[2], gas: 1e6 })
    await campaign.methods.finalizeRequest(0).send({ from: accounts[1], gas: 1e6 })
    let balance = await web3.eth.getBalance(accounts[3])
    balance = parseFloat(web3.utils.fromWei(balance, 'ether'))
    assert(balance > 104.5)
  })
})
