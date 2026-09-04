import { buildPlan } from "../src/lib/engine";
import { products } from "../src/lib/products";
const p = buildPlan({ childName:"Emma", age:7, guests:10, venue:"Backyard", theme:"Elegant Magical Princess", budget:50, diy:"High", durationHours:2.5, startTime:"14:00", dietary:[] } as any);
for (const i of p.items) console.log(i.id, i.name, i.qty ?? "", i.lineTotal, "opt:"+i.optional, "act:"+(i.activityId??"-"));
console.log("---catalogue alternatives---");
for (const pr of products) console.log(pr.id, pr.priority, pr.category, pr.unitPrice, "alt:"+(pr as any).alternativeId, "diy:"+((pr as any).diy?.name??"-"));
