import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useParty } from "@/lib/party-store";

export function BackToParty({ className }: { className?: string }) {
  return (
    <Link
      to="/dashboard"
      className={`inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground ${className ?? ""}`}
    >
      <ArrowLeft className="size-4" strokeWidth={1.5} />
      Back to party
    </Link>
  );
}

export function ProgressBar({ label = "Party progress" }: { label?: string }) {
  const { progress } = useParty();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">{label}</span>
        <span className="text-sm text-muted-foreground">
          {progress.done} / {progress.total} completed
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-sage transition-[width] duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}

export function LockedNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5">
      <p className="text-sm text-muted-foreground">{children}</p>
      <Link
        to="/checkout"
        className="mt-4 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-xs tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
      >
        Unlock the full plan — $29
      </Link>
    </div>
  );
}
