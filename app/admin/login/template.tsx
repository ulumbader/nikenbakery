import type { ReactNode } from "react";
import { PageTransition } from "@/components/public/PageTransition";

export default function AdminLoginTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
