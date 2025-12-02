// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import NextAuth from 'next-auth';
import authOptions from '@app/api/auth/[...nextauth]/options';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
