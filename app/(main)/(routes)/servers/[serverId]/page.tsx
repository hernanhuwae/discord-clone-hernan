import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { redirect } from "next/navigation";

interface IServerId {
  params: Promise<{
    serverId: string;
  }>;

}

const ServerIdPage = async ({ params:paramsPromise }: IServerId) => {

  const params = await paramsPromise
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await prismaDb.server.findFirst({
    where: {
      id: params.serverId,
      Member : {
        some : {
          profileId : profile.id
        }
      }
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

  console.log(server);
  

  const initialChannel = server?.Channel[0];
  

  if (initialChannel?.name !== "general") {
    return (
      <div className="flex items-center justify-center">NOT FOUND</div>
    );
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};


export default ServerIdPage;
