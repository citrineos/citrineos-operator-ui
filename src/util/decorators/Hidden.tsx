export const HIDDEN = 'hidden';

export const Hidden = () => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(HIDDEN, true, target, key);
  };
};
