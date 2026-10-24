import { Logo } from '../components/ui'

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
  { title: 'Company', links: ['About', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help center', 'API docs', 'Status'] },
]

export function MarketingFooter() {
  return (
    <footer className="flex flex-col gap-10 bg-inverse px-6 py-12 lg:px-20">
      <div className="flex flex-wrap items-start gap-16">
        <div className="flex flex-col gap-4">
          <Logo inverse />
          <p className="max-w-80 text-sm leading-5 text-content-disabled">
            Close the loop on every guest complaint — from QR scan to recovered customer.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] text-on-brand uppercase">
              {column.title}
            </p>
            {column.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm leading-5 text-content-disabled hover:text-on-brand"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="h-px bg-content-secondary opacity-40" />

      <div className="flex flex-wrap justify-between gap-2 text-[13px] leading-4.5 text-content-disabled">
        <p>© 2026 ResolveX. All rights reserved.</p>
        <p>Privacy · Terms · Cookies</p>
      </div>
    </footer>
  )
}
