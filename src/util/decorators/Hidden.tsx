export const HIDDEN = {
  DEFAULT: 'hidden',
  EditableInTable: 'EditableInTable',
};

export const Hidden = ({
  isEditableInTable = true,
}: { isEditableInTable?: boolean } = {}) => {
  return (target: any, key: string) => {
    if (isEditableInTable === true) {
      Reflect.defineMetadata(HIDDEN, true, target, key);
    } else {
      Reflect.defineMetadata(
        HIDDEN.EditableInTable,
        isEditableInTable,
        target,
        key,
      );
    }
  };
};
