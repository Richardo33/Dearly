import { PageShell, TopNav } from "@/components/layout/page-shell";
import { Surface } from "@/components/ui/surface";

export default function PersonDetailLoading() {
  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav backHref="/people" backLabel="Back" className="mb-6" />
      <section className="overflow-hidden rounded-[2rem] border border-[#E7D8CB] bg-white shadow-sm">
        <div className="bg-[#2B1D32] px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="h-32 w-32 animate-pulse rounded-full bg-white/15 sm:h-40 sm:w-40" />
            <div className="w-full max-w-xl space-y-4">
              <div className="h-10 w-2/3 animate-pulse rounded-full bg-white/15" />
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/10" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-4 animate-pulse rounded-full bg-white/10" />
                <div className="h-4 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-b border-[#EFE3D8] px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-24 animate-pulse rounded-full bg-[#F8F1E8]"
            />
          ))}
        </div>
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Surface padding="lg" className="h-48 animate-pulse bg-[#FFFDF9]" />
          <Surface padding="lg" className="h-48 animate-pulse bg-[#FFFDF9]" />
        </div>
      </section>
    </PageShell>
  );
}
