import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { currentProfile } from "@/lib/current-profile"
import { prismaDb } from "@/lib/db"
import { redirect } from "next/navigation"

interface IChannelId{
  params : Promise<{
    serverId:string
    channelId:string
  }>
}


const ChannelID = async ({params: paramsPromise}:IChannelId) => {

  const params = await paramsPromise
  const profile = await currentProfile()

  if(!profile){
    return redirect('/sign-in')
  }

  const channel = await prismaDb.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  //Todo: Mengkonfirmasi apakah user yg sedang login (currentUser) memiliki profile Id yang sama dengan MEMBER yg terdaftar pada Channel tertentu (ChannelId) dengan jg memiliki SERVER ID yang sama dengan Channel tertentu (ChannelId) yang sedang dituju
  const member = await prismaDb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  })

  if(!channel || !member){
    redirect('/')
  }


  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
      <ChatMessages
          name={channel.name}
          chatId={channel.id}
          type="channel"
          member={member}
          apiUrl="/api/messages"   //Todo: Buat GET Data messages
          socketUrl="/api/socket/messages"  //Todo: Buat PATCH and DELETE Data Messages
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId
          }}
          paramskey="channelId"
          paramsValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages/message" //Todo: Endpoint akhirnya harus sesuai nama file 'message.ts' untuk POST
        query={{
          channelId: channel.id,
          serverId : channel.serverId
        }}
      />
    </div>
  )
}

export default ChannelID