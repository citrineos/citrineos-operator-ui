export const SUPPORTED_FILE_FORMATS = 'supportedFileFormats';

export const SupportedFileFormats = (formats: string[]) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(SUPPORTED_FILE_FORMATS, formats, target, key);
  };
};
