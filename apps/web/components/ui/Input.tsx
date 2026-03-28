import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#0A0A0A] dark:text-white">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-[#E0E0E0] dark:border-zinc-700 rounded-input outline-none transition-colors focus:border-[#0A0A0A] dark:focus:border-white placeholder:text-zinc-400 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
export default Input;
