import { useEffect, useState } from 'react'

import factory from '../services/factory'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    factory.methods.getDeployedCampaigns().call().then(setCampaigns)
  }, [])

  return <div />
}
