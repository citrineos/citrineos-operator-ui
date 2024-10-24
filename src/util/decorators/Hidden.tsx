export const HIDDEN = 'hidden';

export const Hidden = ({
  isEditableInTable = true,
}: { isEditableInTable?: boolean } = {}) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(HIDDEN, isEditableInTable, target, key);
  };
};
