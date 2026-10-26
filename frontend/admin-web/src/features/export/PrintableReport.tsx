import type { ExportReport } from './csv'

/** Plain document shown only when printing or saving as PDF. It is hidden on screen. */
export function PrintableReport({ report }: { report: ExportReport }) {
  return (
    <article className="hidden text-content print:block">
      <h1 className="text-2xl leading-8 font-semibold">{report.title}</h1>
      <dl className="mt-2 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-0.5 text-sm text-content-secondary">
        {report.meta.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-medium">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {report.sections.map((section) => (
        <section key={section.title} className="mt-6 break-inside-avoid">
          <h2 className="text-base leading-6 font-semibold">{section.title}</h2>
          <table className="mt-2 w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {section.columns.map((c) => (
                  <th key={c} className="border-b border-line-strong py-1.5 pr-3 text-xs font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-line py-1.5 pr-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </article>
  )
}
