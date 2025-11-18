import type { useRouter } from 'next/navigation';

export type RouterPush = ReturnType<typeof useRouter>['push'];
