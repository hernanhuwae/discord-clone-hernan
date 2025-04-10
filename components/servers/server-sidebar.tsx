import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface IServersidebar {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: IServersidebar) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await prismaDb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channel: {
        orderBy: {
          createAt: "asc",
        },
      },
      Member: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannel = server?.Channel.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannel = server?.Channel.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannel = server?.Channel.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const member = server?.Member.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server?.Member.find(
    (members) => members.profileId === profile.id
  )?.role;

  const iconMap = {
    [ChannelType.TEXT]: <Hash className="w-3 h-3 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="w-3 h-3 mr-2" />,
    [ChannelType.VIDEO]: <Video className="w-3 h-3 mr-2" />,
  };

  const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="w-3 h-3 mr-3 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="w-3 h-3 mr-3 text-rose-500" />,
  };

  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader servers={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: member?.map((members) => ({
                  id: members.id,
                  name: members.profile.name,
                  icon: roleIconMap[members.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2 " />

        {/* //Todo : !! artinya boolean dan ini bagian server side channels & member */}

        {!!textChannel?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannel.map((channels) => (
                <ServerChannel
                  key={channels.id}
                  channel={channels}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannel?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Audio Channels"
            />
            <div className="space-y-2">
              {audioChannel.map((channels) => (
                <ServerChannel
                  key={channels.id}
                  channel={channels}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannel?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-2 ">
              {videoChannel.map((channels) => (
                <ServerChannel
                  key={channels.id}
                  channel={channels}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!member?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="member"
              role={role}
              servers={server}
              label="Member"
            />
            <div className="space-y-2">
              {member.map((members) => (
                <ServerMember 
                  key={members.id}
                  member={members}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
