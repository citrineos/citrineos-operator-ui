export const CUSTOM_FORM_RENDER = 'customFormRender';

export const CustomFormRender = (func: Function) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(CUSTOM_FORM_RENDER, func, target, key);
  };
};
