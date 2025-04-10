import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH (_req: Request, {params: paramsPromise} : {params : Promise<{serverId: string}>}) {

    try {
        const profile = await currentProfile()
        const params = await paramsPromise

        if(!profile){
            return new NextResponse('Unauthorized' , {status: 400})
        }

        if(!params.serverId){
            return new NextResponse('Server_ID no found', {status: 400})
        }

        const server= await prismaDb.server.update({
            where:{
                id: params.serverId,
                profileId: profile.id
            },
            data : {
                inviteCode: uuidv4()
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[INVITE_CODE ERROR]', error);
        return new NextResponse('SERVER_ID ERROR' , {status: 500})
    }

}