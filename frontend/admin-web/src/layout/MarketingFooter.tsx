import { Logo } from '../components/ui'

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
  { title: 'Company', links: ['About', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help center', 'API docs', 'Status'] },
]

export function MarketingFooter() {
  return (
    <footer className="bg-inverse text-on-brand">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo inverse />
          <p className="max-w-xs text-sm text-content-disabled">
            Close the loop on every guest complaint — from QR scan to recovered customer.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <p className="text-sm font-semibold">{column.title}</p>
            {column.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-content-disabled hover:text-on-brand"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-content/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-content-disabled">
          <span>© 2026 ResolveX. All rights reserved.</span>
          <span>Privacy · Terms · Cookies</span>
        </div>
      </div>
    </footer>
  )
}
