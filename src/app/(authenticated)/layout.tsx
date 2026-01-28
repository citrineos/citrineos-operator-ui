// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

// import authOptions from "@app/api/auth/[...nextauth]/options";
import AuthenticatedLayout from '@lib/client/components/authenticated-layout';
import React from 'react';

export default async function Layout({ children }: React.PropsWithChildren) {
  // const data = await getData();

  // if (!data.session?.user) {
  //   return redirect("/login");
  // }

  return (
    <AuthenticatedLayout authKey="authenticated">
      {children}
    </AuthenticatedLayout>
  );
}

// async function getData() {
//   const session = await getServerSession(authOptions);
//   return {
//     session,
//   };
// }
