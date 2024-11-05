export const COMBINED_FORM_RENDER = 'combinedFormRender';

export const CombinedFormRender = (combination: Record<string, any>[]) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(COMBINED_FORM_RENDER, combination, target, key);
  };
};
