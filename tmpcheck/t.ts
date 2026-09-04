import { buildPlan } from "../src/lib/engine";
const base = { childName:"Emma", age:7, guests:10, venue:"Backyard", theme:"Elegant Magical Princess", budget:200, diy:"Medium", durationHours:2.5, startTime:"14:00", dietary:[] } as any;
const scen = [
 ["A 200 Med",{budget:200,diy:"Medium"}],
 ["B 150 High",{budget:150,diy:"High"}],
 ["C 150 Low",{budget:150,diy:"Low"}],
 ["D 50 High",{budget:50,diy:"High"}],
 ["E 300 Med",{budget:300,diy:"Medium"}],
 ["F 500 Low",{budget:500,diy:"Low"}],
 ["G 15kids 150 High",{budget:150,diy:"High",guests:15}],
] as const;
for (const [n,o] of scen as any) {
  const p = buildPlan({...base,...o});
  console.log(`${n}: total=${p.total} budget=${p.budget} over=${p.overBudget} acts=${p.activities.length} prep=${p.prepMinutes} items=${p.items.length}`);
  console.log("   acts:", p.activities.map((a:any)=>a.activity.name+"/"+a.tier.id).join(" | "));
  console.log("   decisions:", p.decisions.map((d:any)=>d.label).join(" ; "));
}
const a=JSON.stringify(buildPlan(base)), b=JSON.stringify(buildPlan(base));
console.log("H deterministic:", a===b);
