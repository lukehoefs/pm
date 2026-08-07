import type { Database, Product } from "./types";
import { VENDOR_CATALOG } from "./vendor-catalog";

function seedProducts(now: string): Product[] {
  return VENDOR_CATALOG.flatMap((vendor) =>
    vendor.products.map(
      (p): Product => ({
        id: crypto.randomUUID(),
        name: p.name,
        manufacturer: p.manufacturer,
        model: p.model,
        category: p.category,
        keywords: p.keywords,
        datasheetFile: null,
        datasheetUrl: p.datasheetUrl,
        createdAt: now,
        updatedAt: now,
      }),
    ),
  );
}

export function seedDatabase(): Database {
  const now = new Date().toISOString();
  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  const p1 = "11111111-1111-4111-8111-111111111111";
  const p2 = "22222222-2222-4222-8222-222222222222";
  const p3 = "33333333-3333-4333-8333-333333333333";

  return {
    projects: [
      {
        id: p1,
        name: "Harbor Walk Seawall Repair",
        client: "City of Clearwater",
        location: "Clearwater Beach, FL",
        status: "active",
        description:
          "Phase 2 seawall reconstruction and public walkway upgrades along the harbor frontage.",
        startDate: day(-45),
        targetDate: day(90),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: p2,
        name: "County Rd 54 Drainage Improvements",
        client: "Pasco County",
        location: "Land O' Lakes, FL",
        status: "active",
        description:
          "Stormwater conveyance upgrades, box culverts, and roadway restoration.",
        startDate: day(-20),
        targetDate: day(120),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: p3,
        name: "Marina Basin Dredge Study",
        client: "Upshore Marine Partners",
        location: "Tarpon Springs, FL",
        status: "planning",
        description:
          "Pre-construction hydrographic survey, spoil plan, and permit package.",
        startDate: day(14),
        targetDate: day(180),
        createdAt: now,
        updatedAt: now,
      },
    ],
    tasks: [
      {
        id: crypto.randomUUID(),
        projectId: p1,
        title: "Submit as-built survey package",
        description: "Compile survey CAD and deliverables for city review.",
        status: "in_progress",
        priority: "high",
        assignee: "M. Torres",
        dueDate: day(7),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p1,
        title: "Pour sheet-pile cap — Segment B",
        description: "Coordinate concrete pour with tide window.",
        status: "todo",
        priority: "urgent",
        assignee: "Field Crew A",
        dueDate: day(3),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p1,
        title: "RFI-12: Handrail embed details",
        description: "Architect response pending on alternate embed plate.",
        status: "review",
        priority: "medium",
        assignee: "A. Chen",
        dueDate: day(5),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p1,
        title: "Mobilize temporary pedestrian detour",
        description: "",
        status: "done",
        priority: "high",
        assignee: "Field Crew A",
        dueDate: day(-10),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p2,
        title: "Utility locate — Phase 1 corridor",
        description: "Sunshine 811 ticket and private locates.",
        status: "todo",
        priority: "high",
        assignee: "J. Patel",
        dueDate: day(2),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p2,
        title: "Shop drawings — precast box culvert",
        description: "Vendor submittal package S-04.",
        status: "in_progress",
        priority: "medium",
        assignee: "A. Chen",
        dueDate: day(10),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p2,
        title: "Daily SWPPP inspection log",
        description: "Rain event follow-up required.",
        status: "backlog",
        priority: "low",
        assignee: "M. Torres",
        dueDate: day(1),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p3,
        title: "Draft permit matrix",
        description: "USACE, FDEP, and local marina requirements.",
        status: "todo",
        priority: "high",
        assignee: "A. Chen",
        dueDate: day(21),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId: p3,
        title: "Schedule hydrographic survey vessel",
        description: "",
        status: "backlog",
        priority: "medium",
        assignee: "",
        dueDate: day(30),
        createdAt: now,
        updatedAt: now,
      },
    ],
    products: seedProducts(now),
    submittals: [],
  };
}
