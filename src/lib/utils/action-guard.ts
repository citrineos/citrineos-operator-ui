import { getServerSession } from 'next-auth';
import authOptions from '@app/api/auth/[...nextauth]/options';
import { type Session } from 'next-auth';

interface AuthedSession extends Session {
  accessToken: string;
  idToken: string;
  error?: string;
  user: Session['user'] & {
    roles: string[];
    tenantId: string;
  };
}

export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'ERROR';
    };

export async function authedAction<T>(
  fn: (session: AuthedSession) => Promise<T>,
): Promise<ActionResult<T>> {
  let session: AuthedSession | null = null;

  try {
    session = (await getServerSession(authOptions)) as AuthedSession | null;
  } catch {
    return {
      success: false,
      error: 'Failed to retrieve session',
      code: 'ERROR',
    };
  }

  if (!session?.user) {
    return { success: false, error: 'Unauthenticated', code: 'UNAUTHORIZED' };
  }

  // Keycloak refresh failed — token is dead, force re-login
  if (session.error === 'RefreshAccessTokenError') {
    return { success: false, error: 'Session expired', code: 'UNAUTHORIZED' };
  }

  try {
    return { success: true, data: await fn(session) };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message, code: 'ERROR' };
  }
}

// -------------------------------------------------------
// Role-gated guard
// -------------------------------------------------------

export async function authedActionWithRole<T>(
  requiredRole: string,
  fn: (session: AuthedSession) => Promise<T>,
): Promise<ActionResult<T>> {
  return authedAction(async (session) => {
    if (!session.user.roles?.includes(requiredRole)) {
      // Escape hatch: throw a typed error the outer wrapper can re-map
      throw new ForbiddenError(`Required role: ${requiredRole}`);
    }
    return fn(session);
  }).then((result) => {
    if (!result.success && result.error.startsWith('Required role:')) {
      return { ...result, code: 'FORBIDDEN' as const };
    }
    return result;
  });
}

class ForbiddenError extends Error {}

// -------------------------------------------------------
// Tenant-scoped guard — ensures action is called in the
// context of the tenant the user actually belongs to
// -------------------------------------------------------

export async function authedActionForTenant<T>(
  tenantId: string,
  fn: (session: AuthedSession) => Promise<T>,
): Promise<ActionResult<T>> {
  return authedAction(async (session) => {
    if (session.user.tenantId !== tenantId) {
      throw new ForbiddenError(`Tenant mismatch`);
    }
    return fn(session);
  }).then((result) => {
    if (!result.success && result.error === 'Tenant mismatch') {
      return { ...result, code: 'FORBIDDEN' as const };
    }
    return result;
  });
}
