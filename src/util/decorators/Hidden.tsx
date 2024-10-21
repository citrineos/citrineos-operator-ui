export const HIDDEN = 'hidden';

export const Hidden = ({
  isEditable = true,
}: { isEditable?: boolean } = {}) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(HIDDEN, isEditable, target, key);
  };
};
