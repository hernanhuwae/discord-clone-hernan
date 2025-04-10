import { currentProfile } from "@/lib/current-profile"
import { prismaDb } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH (req:Request, {params:paramsPromise}:{params : Promise<{serverId: string}>}){

    try {
        
        const params = await paramsPromise
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized' , {status:400})
        }

        if(!params.serverId){
            return new NextResponse('Server ID Is Missing', {status:400})
        }

        const server = await prismaDb.server.update({
            where : {
                id : params.serverId,
                profileId : {
                    not : profile.id
                },
                Member : {
                    some : {
                        profileId : profile.id
                    }
                }
            },
            data : {
                Member : {
                    deleteMany : {
                        profileId : profile.id
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[LEAVE_SERVER]', error)
        return new NextResponse('[ERROR_LEAVE_SERVER]' , {status:500})
    }


}