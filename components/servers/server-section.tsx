"use client";

import { ServerWithMemberWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModalStores } from "@/hooks/use-modal";

interface IServersection {
  label: string;
  role?: MemberRole;
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  servers?: ServerWithMemberWithProfile;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  servers,
}: IServersection) => {
  
  const { onOpen } = useModalStores();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase  font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel",{channelTypeValue : channelType})}
            className="text-zinc-500 hover:text-zinc-600 
                    dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === "member" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("member", { server: servers })}
            className="text-zinc-500 hover:text-zinc-600 
                  dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="w-5 h-5" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
