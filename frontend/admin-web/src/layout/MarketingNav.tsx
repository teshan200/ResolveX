import { Link } from 'react-router-dom'
import { Button, Logo } from '../components/ui'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
]

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 h-18 border-b border-line-subtle bg-surface">
      <div className="flex h-full items-center gap-10 px-6 lg:px-20">
        <Link to="/" aria-label="ResolveX home">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm leading-5 font-medium text-content-secondary hover:text-content"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-6 md:ml-0">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold text-content-secondary">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button className="font-semibold">Start free trial</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
