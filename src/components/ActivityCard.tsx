import { Link } from "@tanstack/react-router";
import { useParty } from "@/lib/party-store";
import { productsByIds, type Activity } from "@/lib/plan";

/**
 * Summary depth of an activity — enough to judge it, not enough to run it.
 * Shared by the dashboard, the preview and the activities list.
 */
export function ActivityCard({ activity }: { activity: Activity }) {
  const { details } = useParty();
  const product = productsByIds(details, activity.productIds)[0];

  return (
    <Link
      to="/activities/$activityId"
      params={{ activityId: activity.id }}
      className="surface flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      {product ? (
        <img
          src={product.image}
          alt={product.name}
          width={640}
          height={640}
          loading="lazy"
          className="h-32 w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow">{activity.duration}</span>
          <span className="size-1 rounded-full bg-gold" />
          <span className="eyebrow">{activity.effort}</span>
          <span className="size-1 rounded-full bg-gold" />
          <span className="eyebrow">
            Ages {activity.ageMin}–{activity.ageMax}
          </span>
        </div>
        <h3 className="mt-3 text-2xl">{activity.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activity.summary}</p>
        <p className="mt-3 text-sm leading-relaxed">
          <span className="eyebrow">What they do</span>
          <span className="mt-1 block text-muted-foreground">{activity.making}</span>
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {activity.materials(details.guests)
            .slice(0, 3)
            .map((n) => (
              <li key={n} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                {n}
              </li>
            ))}
        </ul>
        <span className="mt-5 text-sm text-gold">Instructions →</span>
      </div>
    </Link>
  );
}
