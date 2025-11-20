import * as React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export const Badge = ({ className = "", variant = "default", ...props }: BadgeProps) => {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide";
  const styles =
    variant === "outline"
      ? "border border-slate-700 text-slate-300 bg-slate-900/40"
      : "bg-sky-600 text-white";

  return <span className={`${base} ${styles} ${className}`} {...props} />;
};
