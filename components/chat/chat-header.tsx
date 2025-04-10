import { Hash } from "lucide-react"
import { MobileToggle } from "../mobile-toggle"
import { UserAvatar } from "../use-avatar"
import { SocketIndicator } from "../socket-indicator"

interface IChatHeader{
    serverId: string
    name: string
    type: 'channel' | 'conversation'
    imageUrl?: string
}


export const ChatHeader = ({serverId,name,type,imageUrl}:IChatHeader)=> {

    return(
        <div className="flex items-center font-semibold text-md h-12 mx-2 border-neutral-200
            dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId}/>
            {type === 'channel' && (
                <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2"/>
            )}

            {type === 'conversation' && (
                <UserAvatar
                    className="h-7 w-7 mr-2 my-1"
                    src={imageUrl}
                />
            )}
            <p className="font-semibold text-black text-md dark:text-white">
                {name}
            </p>
            <div className="flex items-center ml-auto">
                <SocketIndicator/>
            </div>
        </div>
    )
}