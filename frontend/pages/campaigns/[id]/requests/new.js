import { useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'

import Layout from '../../../../components/Layout'
import { resolveCampaign } from '../../../../services/campaign'
import web3 from '../../../../services/web3'
import Link from 'next/link'

export default function RequestNew({ address }) {
  const router = useRouter()
  const [data, setData] = useState({ description: '', value: '', recipient: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async ev => {
    ev.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { description, value, recipient } = data
      const campaign = resolveCampaign(address)
      const [account] = await web3.eth.getAccounts()
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: account })
      router.push(`/campaigns/${address}/requests`)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = ev => {
    let { id, value } = ev.target
    if (id === 'value') {
      value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
    }

    setData({ ...data, [id]: value })
  }

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label htmlFor="description">Description</label>
          <Input id="description" value={data.description} onChange={handleChange} required />
        </Form.Field>

        <Form.Field>
          <label htmlFor="value">Value</label>
          <Input
            id="value"
            label="ether"
            labelPosition="right"
            value={data.value}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label htmlFor="recipient">Recipient</label>
          <Input id="recipient" value={data.recipient} onChange={handleChange} required />
        </Form.Field>

        <Message error header="Ops!" content={errorMessage} />

        <Button primary type="submit" loading={isLoading} disabled={isLoading}>
          Create!
        </Button>
        <Link href={`/campaigns/${address}/requests`}>
          <a>
            <Button secondary disabled={isLoading}>
              Back
            </Button>
          </a>
        </Link>
      </Form>
    </Layout>
  )
}

RequestNew.getInitialProps = ({ query: { id } }) => {
  return { address: id }
}
