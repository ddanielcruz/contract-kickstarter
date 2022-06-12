import { Button, Table } from 'semantic-ui-react'

import { resolveCampaign } from '../services/campaign'
import web3 from '../services/web3'

export default function RequestRow({ id, request, approversCount, address }) {
  const { Row, Cell } = Table

  const handleApprove = async () => {
    const [account] = await web3.eth.getAccounts()
    const campaign = resolveCampaign(address)
    await campaign.methods.approveRequest(id).send({ from: account })
  }

  const handleFinalize = async () => {
    const [account] = await web3.eth.getAccounts()
    const campaign = resolveCampaign(address)
    await campaign.methods.finalizeRequest(id).send({ from: account })
  }

  return (
    <Row>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        <Button color="green" basic onClick={handleApprove}>
          Approve
        </Button>
      </Cell>
      <Cell>
        <Button color="teal" basic onClick={handleFinalize}>
          Finalize
        </Button>
      </Cell>
    </Row>
  )
}
