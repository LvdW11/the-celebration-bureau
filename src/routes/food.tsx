import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { food } from "@/lib/party";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Food — The Celebration Bureau" },
      { name: "description", content: "A nut-free tea-table menu with make-ahead notes for a princess party at home." },
      { property: "og:title", content: "Food — The Celebration Bureau" },
      { property: "og:description", content: "A tea table children actually eat from." },
    ],
  }),
  component: FoodPage,
});

function FoodPage() {
  return (
    <AppShell
      eyebrow="Food"
      title="The tea table"
      intro="Served seated at 3:15. Almost everything can be made the day before."
    >
      <div className="space-y-8">
        {food.map((course) => (
          <section key={course.course}>
            <h2 className="text-xl">{course.course}</h2>
            <ul className="surface mt-4 divide-y divide-border/70 overflow-hidden">
              {course.items.map((i) => (
                <li key={i.name} className="px-5 py-4 md:px-7">
                  <p className="text-[0.95rem]">{i.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.note}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
