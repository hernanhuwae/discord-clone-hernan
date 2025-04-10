import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { Message } from "@prisma/client";
import {  NextResponse } from "next/server";

const MESSAGE_BATCH = 10

export async function GET(req: Request) {

    try {
        
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const cursor = searchParams.get('cursor') //Todo: tangkap 'cursor' dari hook use-chat-query.ts
        const channelId = searchParams.get('channelId')

        if(!profile){
            return new NextResponse('Unauthorized' , {status: 400})
        }

        if(!channelId){
            return new NextResponse('Channel ID Is Missing', {status: 400})
        }

        let messages : Message[] = []

        if(cursor){
            messages = await prismaDb.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor : {
                    id : cursor
                },
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createAt: 'desc'
                }
            })
        }else{
            messages = await prismaDb.message.findMany({
                take: MESSAGE_BATCH,
                where:{
                    channelId: channelId
                },
                include:{
                    member : {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createAt: 'desc'
                }
            })    
        }

        let nextCursor = null

        if(messages.length === MESSAGE_BATCH){
            nextCursor = messages[MESSAGE_BATCH-1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (error) {
        console.log('[MESSAGE_GET_ERROR]',error);
        return new NextResponse('MESSAGE_GET_ERROR', {status:500})
    }

}