import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-extrabold font-display text-[#edf7ee] mb-2 tracking-tight">Error</h3>
      <p className="text-sm text-[#edf7ee]/60 max-w-md mb-6 leading-relaxed font-normal">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">Try Again</Button>
      )}
    </div>
  );
}
