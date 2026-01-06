import config from '@lib/utils/config';

export const isGcp = config.fileStorageType?.toLowerCase() === 'gcp';
