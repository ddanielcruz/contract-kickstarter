import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Form, Input, Message } from 'semantic-ui-react'

import Layout from '../../components/Layout'
import factory from '../../services/factory'
import web3 from '../../services/web3'

export default function CampaignNew() {
  const [minimumContribution, setMinimumContribution] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async ev => {
    ev.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const accounts = await web3.eth.getAccounts()
      await factory.methods.createCampaign(minimumContribution).send({ from: accounts[0] })
      router.push('/')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = ev => {
    const value = ev.target.value.replace(/\D/g, '')
    setMinimumContribution(value)
  }

  return (
    <Layout>
      <h3>Create a Campaign</h3>

      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label htmlFor="value">Minimum Contribution</label>
          <Input
            id="value"
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Message error header="Ops!" content={errorMessage} />
        <Button type="submit" primary loading={isLoading} disabled={isLoading}>
          Create!
        </Button>
      </Form>
    </Layout>
  )
}
