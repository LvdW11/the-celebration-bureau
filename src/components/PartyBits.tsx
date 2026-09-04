import { Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
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

/**
 * Renders *after* real preview content: says exactly what continues in the
 * full plan, then offers the unlock. Never a bare paywall.
 */
export function LockedContinuation({
  title,
  children,
  className,
  compact,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
  /** Inline variant for use inside a section, between real content. */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-dashed border-border bg-secondary/40 px-5 py-4 ${className ?? ""}`}
      >
        <Lock className="size-3.5 shrink-0 text-gold" strokeWidth={1.5} />
        <p className="flex-1 text-sm text-muted-foreground">
          <span className="text-foreground">{title}</span>
          {children ? <> — {children}</> : null}
        </p>
        <Link to="/checkout" className="text-sm text-gold underline-offset-4 hover:underline">
          Unlock — $29
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-dashed border-border bg-secondary/40 p-6 md:p-7 ${className ?? ""}`}
    >
      <div className="flex gap-3">
        <Lock className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
        <div>
          <p className="text-[0.95rem]">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</p>
        </div>
      </div>
      <Link
        to="/checkout"
        className="mt-5 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-xs tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
      >
        Unlock the full plan — $29
      </Link>
    </div>
  );
}

