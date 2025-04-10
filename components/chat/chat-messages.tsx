'use client'

import { Member, Message, Profile } from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment } from "react"
import { ChatBubble } from "./chat-bubble"
import {format} from 'date-fns'

const FORMAT_DATE = "d MMM yyyy, HH:mm"

interface IChatMessages {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string,string>
    paramskey: 'channelId' | 'conversationId'
    paramsValue: string
    type: 'channel' | 'conversation'
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export const ChatMessages = ({name,apiUrl,chatId,member,paramsValue,paramskey,socketQuery,socketUrl,type}:IChatMessages) => {

    const queryKey = `chat-${chatId}`
    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status} = useChatQuery({
        queryKey,
        apiUrl,
        paramKey: paramskey,
        paramValue: paramsValue
    })

    if(status === 'pending'){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="w-7 h-7 text-zinc-700  animate-spin my-4"/>
                <p className="text-xs text-zinc-500">Message Loading...</p>
            </div>
        )
    }
    if(status === 'error'){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="w-7 h-7 text-zinc-700  animate-spin my-4"/>
                <p className="text-xs text-zinc-500">Error...</p>
            </div>
        )
    }

    return(
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1"/>
            <ChatWelcome
                type= {type}
                name= {name}
            />
            {/* //Todo : FETCH ALL MESSAGES */ }
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group,i)=>(
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile)=>(
                            <ChatBubble
                                key={message.id}
                                id={message.id}
                                currentMember={member} //Todo: User yang sedang login dalam sebuah channel
                                member={message.member} //Todo: User/member sebagai pengirim pesan di chattingan dalam channel
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                isUpdated={message.updateAt !== message.createAt}
                                timeStamp={format(new Date(message.createAt), FORMAT_DATE)}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )

}