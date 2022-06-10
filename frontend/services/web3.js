import Web3 from 'web3'

let web3

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' })
  web3 = new Web3(window.ethereum)
} else {
  // We are on the server OR the user is not running metamask
  const url = 'https://rinkeby.infura.io/v3/0df7c06aaaaf494fb1c1f9fb3ff308ff'
  const provider = new Web3.providers.HttpProvider(url)
  web3 = new Web3(provider)
}

export default web3
