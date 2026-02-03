import { toast } from 'sonner';

export const copy = async (value: string | null | undefined) => {
  if (!value) return;

  await navigator.clipboard.writeText(value);

  toast.message(`Copied ${value} to clipboard.`);
};
