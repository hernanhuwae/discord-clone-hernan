'use client'

import { Member, Message, Profile } from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { ElementRef, Fragment, useRef } from "react"
import { ChatBubble } from "./chat-bubble"
import {format} from 'date-fns'
import { useChatSocket } from "@/hooks/use-chat-socket"
import { useChatScroll } from "@/hooks/use-chat-scroll"
import { ChatPrivateBubble } from "./chat-private-buble"

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



export const ChatPrivateMessages = ({name,apiUrl,chatId,member,paramsValue,paramskey,socketQuery,socketUrl,type}:IChatMessages) => {

    //Todo: Buat ada scroll previous message
    const chatRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    //Todo: 3 variabel dibawah ini harus equal penulisannya seperti const updateKey di [messageId].ts dan penulisan const channelKey di message.ts (pages/api/socket/messages)
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status} = useChatQuery({
        queryKey,
        apiUrl,
        paramKey: paramskey,
        paramValue: paramsValue
    })

    useChatSocket({queryKey,addKey,updateKey})

     //todo : Auto Scroll button
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items.length ?? 0,
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
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">

            {!hasNextPage && <div className="flex-1"/>}

            {!hasNextPage && (
                <ChatWelcome
                type= {type}
                name= {name}
            />
            )}

            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="w-7 h-7 animate-spin my-4"/>
                    ): (
                        <button   
                            onClick={()=> fetchNextPage()}      
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs
                                my-4 dark:hover:text-zinc-300 transition"
                        > 
                            Load Previous messages
                        </button>
                    )} 
                </div>
            )}

            {/* //Todo : FETCH ALL MESSAGES */ }
            {/* Menggunakan <Fragment karena biar ga overload UI karena ada infinite scroll + useInfiniteQuery didalamnya biar DOM bisa tdk ada elemen tambahan biar layout bersih dan ringan */}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group,i)=>(
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile)=>(
                            
                            
                            <ChatPrivateBubble
                                key={message.id}
                                id={message.id}
                                currentMember={member} //Todo: User yang sedang login dalam sebuah conversation
                                member={message.member} //Todo: User/member sebagai pengirim pesan di chattingan dalam conversation
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                isUpdated={message.updatedAt !== message.createdAt}
                                timeStamp={format(new Date(message.createdAt), FORMAT_DATE)}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef}/>
        </div>
    )

}