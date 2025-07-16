import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatPrivateBubble } from "@/components/chat/chat-private-buble"
import { ChatPrivateMessages } from "@/components/chat/chat-privatemessages"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { prismaDb } from "@/lib/db"
import { redirect } from "next/navigation"

interface IConversation {
  params: Promise<{
    serverId: string
    memberId: string
  }>
}


const ConversationPage = async ({params:paramsPromise}:IConversation) => {

  const params = await paramsPromise
  const profile = await currentProfile()

  if(!profile){
    return redirect('/sign-in')
  }

  const currentMember = await prismaDb.member.findFirst({
    where:{
      serverId: params.serverId,
      profileId: profile.id
    },
    include : {
      profile: true
    }
  })

  if(!currentMember){
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

  if(!conversation){
    return redirect(`/servers/${params.serverId}`)
  }

  const {memberOne,memberTwo} = conversation
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white h-screen flex flex-col dark:bg-[#313338]">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={params.serverId}
        imageUrl={otherMember.profile.imageUrl}
        type="conversation"
      />

      <ChatPrivateMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        paramskey="conversationId"
        paramsValue={conversation.id}
        type="conversation"
        apiUrl="/api/directmessage"
        socketUrl="/api/socket/private-message" //Todo: Buat POST, PATCH, and DELETE Data Private Messages
        socketQuery={{
          conversationId : conversation.id
        }}
      />

      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/private-message/privatemessage" //Todo: Endpoint akhirnya harus sesuai nama file 'message.ts' untuk POST
        query={{
          conversationId : conversation.id
        }}
      />
  
    </div>
  )
}

export default ConversationPage;
