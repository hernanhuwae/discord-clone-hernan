'use client'

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../use-avatar";
import { on } from "events";

interface IServerMember{
    member: Member & {profile : Profile}
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="w-3 h-3 mr-3 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="w-3 h-3 mr-3 text-rose-500" />,
  };

export const ServerMember = ({member,server}:IServerMember)=> {

    const router = useRouter()
    const params = useParams()
    const icon = roleIconMap[member.role]

    const onClick = () =>{
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    return (
        <button
            onClick={onClick}
            className={cn('group w-full flex items-center px-2 py-2 rounded-md gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
                params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
            )}
        >
            <UserAvatar className="h-8 w-8 md:h-8 md:w-8 " src={member.profile.imageUrl}/>
            <p className={cn(
                'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
            )}>
                {member.profile.name}
            </p>
            {icon}

        </button>
    )

}