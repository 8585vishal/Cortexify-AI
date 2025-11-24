import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.ComponentProps<"span"> & { variant?: "default" | "outline" }) {
  const base = "badge";
  const styles = variant === "outline" ? "border" : "bg-accent text-foreground";
  return <span className={cn(base, styles, className)} {...props} />;
}