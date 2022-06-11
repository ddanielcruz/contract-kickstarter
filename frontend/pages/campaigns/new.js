import { useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'

import Layout from '../../components/Layout'
import factory from '../../services/factory'
import web3 from '../../services/web3'

export default function CampaignNew() {
  const [minimumContribution, setMinimumContribution] = useState('')

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const accounts = await web3.eth.getAccounts()
    await factory.methods.createCampaign(minimumContribution).send({ from: accounts[0] })
  }

  const handleChange = (ev) => {
    const value = ev.target.value.replace(/\D/g, '')
    setMinimumContribution(value)
  }

  return (
    <Layout>
      <h3>Create a Campaign</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label htmlFor="value">Minimum Contribution</label>
          <Input
            id="value"
            label="Wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Button type="submit" primary>
          Create!
        </Button>
      </Form>
    </Layout>
  )
}
