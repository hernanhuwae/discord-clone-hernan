'use client'

import { cn } from "@/lib/utils"
import { ActionTooltip } from "../action-tooltip"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

interface INavigationItem{
    id: string
    imageUrl: string
    name: string
}

export const NavigationItem: React.FC<INavigationItem> = ({id,imageUrl,name}) => {

    const params = useParams()
    const router = useRouter()
    const onClick = () => {
        router.push(`/servers/${id}`)
    }

    return(
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={onClick} className="group relative flex items-center">

                {/* Buat garis putih kiri tiap server  */}
                <div className={cn('absolute left-0 bg-primary rounded-r-full transition-all w-[4px]' ,
                    params?.serverId !== id && 'group-hover:h-[20px]',
                    params?.serverId === id ? 'h-[35px]' : 'h-[8px]'
                )}/>

                {/* Buat Profile Picture Server */}
                <div className={cn('relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden' ,
                    params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
                )}>
                    <Image src={imageUrl} fill alt="channel"/>
                </div>
            </button>
        </ActionTooltip>
    )
}