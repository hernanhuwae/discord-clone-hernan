import { ServerSidebar } from "@/components/servers/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const ServerIDLayout = async ({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) => {
  const profile = await currentProfile();
  const params = await paramsPromise;

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await prismaDb.server.findUnique({
    where: {
      id: params.serverId,
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

 

  return (
    <div className="h-full">
      <div className="max-md:hidden md:flex fixed flex-col h-full w-60 z-20 inset-y-0 text-white">
        <ServerSidebar serverId={params.serverId}/> 
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIDLayout;