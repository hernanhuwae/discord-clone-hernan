import { currentProfile } from "@/lib/current-profile"
import { prismaDb } from "@/lib/db"
import { redirect } from "next/navigation"

interface IInviteCode{
    params : Promise<{inviteCode : string}>
}


const InviteCodePage = async ({params} : IInviteCode) => {

    const profile = await currentProfile()
   

    if(!profile){
        return redirect('/sign-in')
    }

    if(!(await params).inviteCode){
        return redirect('/')
    }

    const existingServer = await prismaDb.server.findFirst({
        where :{
            inviteCode: (await params).inviteCode,
            Member : {
                some : {
                    profileId : profile.id
                }
            }
        }
    })

    const server = await prismaDb.server.update({
        where: {
            inviteCode : (await params).inviteCode
        },
        data : {
            Member :{
                create : [
                    {
                        profileId : profile.id
                    }
                ]
            }
        }
    })

    if(existingServer){
        return redirect(`/servers/${existingServer.id}`)
    }

    if(server){
        return redirect(`/servers/${server.id}`)
    }

  return null
}

export default InviteCodePage