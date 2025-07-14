import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { redirect } from "next/navigation";

interface IServerId {
  params: Promise<{
    serverId: string;
  }>
}

const ServerIdPage = async ({ params:paramsPromise }: IServerId) => {

  const params = await paramsPromise

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await prismaDb.server.findUnique({
    where: {
      id: params.serverId,
      profileId: profile.id,
    },
    include: {
      Channel: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.Channel[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
