import { Card, Grid } from 'semantic-ui-react'

import ContributeForm from '../../../components/ContributeForm'
import Layout from '../../../components/Layout'
import { resolveCampaign } from '../../../services/campaign'
import web3 from '../../../services/web3'

export default function Campaign({
  address,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager
}) {
  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The managed created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an approver'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend'
      }
    ]

    return <Card.Group items={items} itemsPerRow={2} />
  }

  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Column width={12}>{renderCards()}</Grid.Column>
        <Grid.Column width={4}>
          <ContributeForm address={address} />
        </Grid.Column>
      </Grid>
    </Layout>
  )
}

Campaign.getInitialProps = async ({ query: { id } }) => {
  const campaign = resolveCampaign(id)
  const summary = await campaign.methods.getSummary().call()

  return {
    address: id,
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4]
  }
}
