import { toast } from 'sonner';

export const copy = async (
  value: string | null | undefined,
  displayValue = true,
) => {
  if (!value) return;

  await navigator.clipboard.writeText(value);

  toast.message(`Copied${displayValue ? ` ${value}` : ''} to clipboard.`);
};
