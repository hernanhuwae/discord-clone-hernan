import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST (req: Request){


    try {
        const profile = await currentProfile()
        const {name,type} = await req.json()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get('serverId')
        
        if(!profile){
            return new NextResponse('Unauthorized', {status: 400})
        }

        if(!serverId){
            return new NextResponse('Server ID is missing', {status: 400})
        }

        if(name === 'general'){
            return new NextResponse('Name can`t be a General!', {status:400})
        }


        //Todo: Mengapa memakai update bukan create? karena kita hanya menambahkan channel baru dalam server saat ini, makanya memakai update agar kita tidak membuat server baru

        const server = await prismaDb.server.update({
            where:{
                id: serverId,
                Member : {
                    some : {
                        profileId: profile.id,  
                        role : {
                            in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data :{
                Channel : {
                    create : {
                        profileId : profile.id,
                        name,
                        type
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[CHANNEL_POST]', error);
        return new NextResponse('[ERROR_CHANNEL_POST]', {status: 500})
    }

}