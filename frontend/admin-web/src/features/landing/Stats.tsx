const stats = [
  { value: '38%', label: 'faster average resolution' },
  { value: '2.4×', label: 'more guests recovered after a complaint' },
  { value: '< 15 min', label: 'median acknowledgement time' },
  { value: '32', label: 'branches managed from one console' },
]

export function Stats() {
  return (
    <section id="customers" className="bg-surface">
      <dl className="grid gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-20">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <dd className="order-1 text-4xl leading-11 font-bold tracking-[-0.54px] text-content-brand">
              {stat.value}
            </dd>
            <dt className="order-2 text-sm leading-5 text-content-secondary">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
