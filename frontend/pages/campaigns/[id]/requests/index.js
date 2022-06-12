import Link from 'next/link'
import { Button, Table } from 'semantic-ui-react'

import Layout from '../../../../components/Layout'
import RequestRow from '../../../../components/RequestRow'
import { resolveCampaign } from '../../../../services/campaign'

export default function Requests({ address, approversCount, requests }) {
  const { Header, Row, HeaderCell, Body } = Table

  const renderRows = () => {
    return requests.map((request, index) => (
      <RequestRow
        key={index}
        id={index}
        request={request}
        address={address}
        approversCount={approversCount}
      />
    ))
  }

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary>Add Request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
    </Layout>
  )
}

Requests.getInitialProps = async ({ query: { id } }) => {
  const campaign = resolveCampaign(id)
  const approversCount = await campaign.methods.approversCount().call()
  const requestCount = await campaign.methods.getRequestsCount().call()
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((_, idx) => campaign.methods.requests(idx).call())
  )

  return { address: id, approversCount, requests }
}
