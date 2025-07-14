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

    // Todo : kondisi saat member sudah join server trus copas link invitecode di server yang sama/ server yang sudah join sebelumnya
    
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

    //Todo: Saat kita tambah member baru, kita membuat profile Id-nya sebagai member dari server tersebut
    //Todo: Kondisi saat member baru pertama kali join

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