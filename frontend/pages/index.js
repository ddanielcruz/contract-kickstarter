import Link from 'next/link'
import { Card, Button } from 'semantic-ui-react'
import Layout from '../components/Layout'

import factory from '../services/factory'

export default function Home({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => ({
      header: address,
      description: <a href="#">View Campaign</a>,
      fluid: true
    }))

    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <a>
          <Button content="Create Campaign" icon="add circle" primary floated="right" />
        </a>
      </Link>
      {renderCampaigns()}
    </Layout>
  )
}

Home.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call()
  return { campaigns }
}
