import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { PrivateMessage } from "@prisma/client";
import {  NextResponse } from "next/server";

const MESSAGE_BATCH = 10

export async function GET(req: Request) {

    try {
        
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const cursor = searchParams.get('cursor') //Todo: tangkap 'cursor' dari hook use-chat-query.ts
        const conversationId = searchParams.get('conversationId')

        if(!profile){
            return new NextResponse('Unauthorized' , {status: 400})
        }

        if(!conversationId){
            return new NextResponse('Conversation ID Is Missing', {status: 400})
        }

        let messages : PrivateMessage[] = []

        if(cursor){
            messages = await prismaDb.privateMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor : {
                    id : cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt : 'desc'
                }
            })
        }else{
            messages = await prismaDb.privateMessage.findMany({
                take: MESSAGE_BATCH,
                where:{
                    conversationId
                },
                include:{
                    member : {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
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
        console.log('[PRIVATE-MESSAGE_GET_ERROR]',error);
        return new NextResponse('PRIVATE-MESSAGE_GET_ERROR', {status:500})
    }

}