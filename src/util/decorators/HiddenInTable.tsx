export const HIDDENINTABLE = 'hiddenInTable';

export const HiddenInTable = ({
  hiddenOnlyWhenEditing,
}: {
  hiddenOnlyWhenEditing: boolean;
}) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(HIDDENINTABLE, hiddenOnlyWhenEditing, target, key);
  };
};
