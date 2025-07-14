import { useSocket } from "@/components/providers/socket-provider"
import { Member, Message, Profile } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type IUseChatSokcet = {
    // Todo: ikutin nama variabel di chat-message.tsx
    addKey: string
    updateKey: string
    queryKey: string 
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }

}


export const useChatSocket = ({addKey,queryKey,updateKey}:IUseChatSokcet) => {

    const {socket} = useSocket()
    const queryClient = useQueryClient()

    useEffect(()=>{

        if(!socket){
            return;
        }

        socket.on(updateKey, (message:MessageWithMemberWithProfile)=>{
            queryClient.setQueryData([queryKey], (oldData:any)=>{

                //Todo: nama variabel 'pages' dipakai karena default dari infinitequery
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData
                }

                const newData =  oldData.pages.map((page:any)=>{ 

                    return {

                        ...page,
                        items: page.items.map((item:MessageWithMemberWithProfile)=>{  //Todo: nama variabel 'items' dipakai karena default dari infinitequery

                            if(item.id === message.id){  //Todo: item.id (id message yang konten messagenya yang sudah di PATCH / Diedit ) dan message.id (message lama yang belum di PATCH)
                                return message
                            }

                            return item

                        })

                    }

                })

                return {
                    ...oldData,
                    pages: newData  //Todo: nama variabel 'pages' dipakai karena default dari infinitequery
                }

            })
        })


        socket.on(addKey, (message:MessageWithMemberWithProfile)=> {

            queryClient.setQueryData([queryKey], (oldData:any)=>{

                if(!oldData || !oldData.pages || oldData.pages.length === 0){

                    return {
                        pages: [{
                            items: message
                        }]
                    }
                }

                const newData = [...oldData.pages]

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,  //Todo: merupakan pesan baru yang baru di POST dan digabungkan dengan data message lama '...newData[0].items'
                        ...newData[0].items
                    ]
                }

                return {
                    ...oldData,
                    pages: newData
                }

            })

        })
        
        return () => {
            socket.off(addKey)
            socket.off(updateKey)
        }

    },[queryClient,addKey,queryKey,updateKey,socket]) 

    //Todo: addKey dan updateKey masuk ke depedency karena berubah mengikuti channel Id dalam format const channelKey = `chat:${channelId}:messages` di (message.ts)
    //Todo: QueryClient karena data message yang banyak akan dibuat per halaman melalui tanstack query
    //Todo: socket pastinya akan ada kondisi on dan off


}