import { useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'

import { resolveCampaign } from '../services/campaign'
import web3 from '../services/web3'

export default function ContributeForm({ address }) {
  const router = useRouter()
  const [contribution, setContribution] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = ev => {
    const value = ev.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
    setContribution(value)
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const accounts = await web3.eth.getAccounts()
      const campaign = resolveCampaign(address)
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether')
      })
      router.replace(`/campaigns/${address}`)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit} error={!!errorMessage}>
      <Form.Field>
        <label htmlFor="value">Amount to Contribute</label>
        <Input
          id="value"
          label="ether"
          labelPosition="right"
          value={contribution}
          onChange={handleChange}
        />
      </Form.Field>
      <Message error header="Ops!" content={errorMessage} />
      <Button primary type="submit" loading={isLoading} disabled={isLoading}>
        Contribute!
      </Button>
    </Form>
  )
}
