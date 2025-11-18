import { type BackFunction, useBack, useParsed } from '@refinedev/core';

export const useOnBack = (): BackFunction | undefined => {
  const back = useBack();
  const { action } = useParsed();

  const onBack =
    action !== 'list' || typeof action !== 'undefined' ? back : undefined;

  return onBack;
};
