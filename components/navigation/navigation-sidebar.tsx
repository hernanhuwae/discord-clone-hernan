import { prismaDb } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const  NavigationSidebar = async () => {
  
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const servers = await prismaDb.server.findMany({
    where: {
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="bg-[#2b16b3cf] flex flex-col space-y-4 items-center w-full h-full text-primary dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4 ">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[45px] w-[45px]",
            },
          }}
        />
      </div>
    </div>
  );
};
