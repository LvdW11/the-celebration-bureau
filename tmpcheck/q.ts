import { buildPlan } from "../src/lib/engine";
const b={childName:"Emma",age:7,guests:10,venue:"Backyard",theme:"Elegant Magical Princess",budget:300,diy:"Medium",durationHours:2.5,startTime:"14:00",dietary:[]} as any;
for (const g of [10,15]) {
  const p=buildPlan({...b,guests:g});
  console.log("guests",g,"total",p.total);
  for (const i of p.items) console.log("  ",i.id,i.quantity ?? (i as any).qty, "x", i.unitPrice ?? "", "=", i.lineTotal);
}
