import { Menu } from 'semantic-ui-react'
import Link from 'next/link'

export default function Header() {
  return (
    <Menu style={{ marginTop: '1rem' }}>
      <Link href="/">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link href="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link href="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  )
}
