'use client'

import { useSocket } from "./providers/socket-provider"
import { Badge } from "./ui/badge"

export const SocketIndicator = () => {

    const {isConnected} = useSocket()

    if(!isConnected){
        return(
            <Badge variant='outline' className="bg-yellow-500 text-white border-none">
                Fallback : polling every 1s
            </Badge>
        )
    }

    return(
        <Badge variant='outline' className="bg-emerald-500 text-white border-none">
            Live: Realtime
        </Badge>
    )

}