import { currentProfile } from "@/lib/current-profile"
import { prismaDb } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"
import {v4 as uuidv4} from 'uuid'

export async function POST (req:Request){
    try {

        const {name, imageUrl} = await req.json()
        const profile = await currentProfile()

        if(!profile){
            throw new NextResponse ('Unauthorized', {status: 401})
        }

        const server = await prismaDb.server.create({
            data:{
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                Channel: {
                    create:[
                        {name: 'general', profileId: profile.id}
                    ]
                },
                Member:{
                    create:[
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })

        return NextResponse.json(server)
        
    } catch (error) {
        console.log('SERVER ERROR POST', error);
        return new NextResponse('Internal Error' , {status: 500})
        
    }
}