import type { ReactNode } from "react";
import { SUBJECTS } from "../utils/curriculum-data";

export function CurriculumGuard({ children }: { children: ReactNode }) {
  if (SUBJECTS.length > 0) return <>{children}</>;

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl rounded-xl border border-destructive/40 bg-card p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">
          Curriculum Catalog Error
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The subject catalog could not be loaded. Please ensure the DepEd curriculum configurations are valid.
        </p>
      </div>
    </div>
  );
}
