"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DataTable,
  type DataTableColumn,
  type TableDensity,
} from "@/components/ui/data-table";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type InvoiceRow = {
  id: string;
  customer: string;
  plan: string;
  amount: string;
  status: string;
  detail: string;
};

const ALL_ROWS: InvoiceRow[] = [
  {
    id: "inv_1050",
    customer: "Northwind Labs",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Paid",
    detail: "Renewed automatically on May 12. Receipt sent to billing@northwind.dev.",
  },
  {
    id: "inv_1049",
    customer: "Studio Meridian",
    plan: "Teams",
    amount: "Custom",
    status: "Pending",
    detail: "Awaiting PO approval from procurement. Sales follow-up scheduled.",
  },
  {
    id: "inv_1048",
    customer: "Orbit Systems",
    plan: "Pro Lifetime",
    amount: "$199.00",
    status: "Paid",
    detail: "Lifetime license issued. CLI access enabled.",
  },
  {
    id: "inv_1047",
    customer: "Cascade AI",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Overdue",
    detail: "Payment failed on June 28. Sent two reminders.",
  },
  {
    id: "inv_1046",
    customer: "Fjord Digital",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Paid",
    detail: "Applied credit from the referral program.",
  },
  {
    id: "inv_1045",
    customer: "Helix Studio",
    plan: "Pro Lifetime",
    amount: "$199.00",
    status: "Paid",
    detail: "Bulk purchase: 3 lifetime seats.",
  },
  {
    id: "inv_1044",
    customer: "Pinecone Inc.",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Pending",
    detail: "First purchase, fraud review in progress.",
  },
  {
    id: "inv_1043",
    customer: "Axiom Research",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Paid",
    detail: "Team add-on seats purchased.",
  },
  {
    id: "inv_1042",
    customer: "Vantage Health",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Canceled",
    detail: "Cancellation requested by the account owner.",
  },
  {
    id: "inv_1041",
    customer: "Meridian East",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Paid",
    detail: "Quarterly billing cycle.",
  },
  {
    id: "inv_1040",
    customer: "Kepler Data",
    plan: "Pro Lifetime",
    amount: "$199.00",
    status: "Paid",
    detail: "Upgraded from Pro Annual mid cycle.",
  },
  {
    id: "inv_1039",
    customer: "Talus Bio",
    plan: "Pro Annual",
    amount: "$169.00",
    status: "Overdue",
    detail: "Third reminder sent. Collections pending.",
  },
];

function statusClass(status: string) {
  const map: Record<string, string> = {
    Paid: "text-emerald-500 dark:text-emerald-400",
    Pending: "text-amber-500 dark:text-amber-400",
    Overdue: "text-red-500 dark:text-red-400",
    Canceled: "text-[color:var(--muted-foreground)]",
  };
  return cn("text-xs font-medium", map[status] ?? "");
}

const COLUMNS: DataTableColumn<InvoiceRow>[] = [
  { id: "customer", header: "Customer", accessorKey: "customer", sortable: true },
  { id: "plan", header: "Plan", accessorKey: "plan", sortable: true },
  { id: "amount", header: "Amount", accessorKey: "amount", sortable: true },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    sortable: true,
    cell: ({ row }) => <span className={statusClass(row.status)}>{row.status}</span>,
  },
];

const DENSITIES = ["compact", "comfortable", "spacious"] as const;

const settings = {
  sortable: true,
  filterable: true,
  selectable: true,
  expandable: true,
  paginated: true,
  pageSize: 5,
  density: "comfortable",
};

function densityOf(value: string): TableDensity {
  return (DENSITIES as readonly string[]).includes(value)
    ? (value as TableDensity)
    : "comfortable";
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const pageSize = Math.max(1, Math.round(s.pageSize));
  const [selectedIds, setSelectedIds] = React.useState(["inv_1048"]);

  return (
    <div className="flex min-h-[360px] w-full items-start justify-center bg-[var(--background)] p-6">
      <div
        className={cn(
          "w-full max-w-3xl overflow-hidden rounded-2xl border p-4 sm:p-5",
          "border-black/[0.08] bg-[#f4f4f5] [box-shadow:0_1px_2px_rgba(0,0,0,.06),0_8px_24px_-12px_rgba(0,0,0,.08)]",
          "dark:border-white/[0.06] dark:bg-[#0a0a0b] dark:[box-shadow:0_1px_2px_rgba(0,0,0,.4),0_8px_24px_-12px_rgba(0,0,0,.6)]",
        )}
      >
        <p className="mb-1 text-sm font-semibold tracking-[-0.015em] text-[var(--foreground)]">
          Recent invoices
        </p>
        <p className="mb-4 text-[11px] text-[var(--muted-foreground)]">
          Search, sort, select rows, page through results, and expand a row for the receipt note.
        </p>
        <DataTable
          columns={COLUMNS}
          data={ALL_ROWS}
          density={densityOf(s.density)}
          sortable={s.sortable}
          filterable={
            s.filterable ? { placeholder: "Search invoices" } : false
          }
          selectable={
            s.selectable
              ? {
                  selectedIds,
                  onSelectionChange: setSelectedIds,
                }
              : false
          }
          paginated={s.paginated ? { pageSize } : false}
          expandable={
            s.expandable
              ? {
                  renderExpanded: (row) => (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      <span className="font-medium text-[var(--foreground)]">
                        {row.id}.
                      </span>{" "}
                      {row.detail}
                    </p>
                  ),
                }
              : false
          }
        />
      </div>
    </div>
  );
}
