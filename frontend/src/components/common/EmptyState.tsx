import { PackageOpen } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center mb-5">
        {icon || <PackageOpen className="w-8 h-8 text-[#4ade80]" />}
      </div>
      <h3 className="text-xl font-extrabold font-display text-[#edf7ee] mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-[#edf7ee]/60 max-w-md mb-6 leading-relaxed font-normal">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">{actionLabel}</Button>
      )}
    </div>
  );
}
