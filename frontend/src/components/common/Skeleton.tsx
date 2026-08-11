export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
  );
}

export function CenterCardSkeleton() {
  return (
    <div className="bg-[#0d1611]/80 rounded-3xl border border-white/10 p-7 sm:p-8 space-y-4 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4 bg-white/10" />
          <Skeleton className="h-3 w-1/3 bg-white/5" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
      </div>
      <Skeleton className="h-3 w-full bg-white/5" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
        <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
        <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-20 bg-white/5" />
        <Skeleton className="h-9 w-24 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#0d1611]/80 rounded-3xl border border-white/10 p-7 sm:p-8 space-y-4 shadow-lg">
      <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
      <Skeleton className="h-8 w-16 bg-white/10" />
      <Skeleton className="h-4 w-24 bg-white/5" />
    </div>
  );
}
