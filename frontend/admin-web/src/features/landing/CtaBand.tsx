import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'

export function CtaBand() {
  return (
    <section className="flex flex-col items-center gap-5 bg-brand px-6 py-16 text-center text-on-brand lg:px-20">
      <h2 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">
        Stop losing guests to unanswered complaints
      </h2>
      <p className="max-w-150 text-base leading-6 opacity-85">
        Launch your first branch today — forms, QR codes and SLA rules come pre-configured for
        restaurants.
      </p>
      <Link to="/register">
        <Button size="lg" variant="secondary">
          Start free trial
        </Button>
      </Link>
    </section>
  )
}
