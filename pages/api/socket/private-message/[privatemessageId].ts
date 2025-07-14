import { currentProfileSocket } from "@/lib/current-profile-socket";
import { prismaDb } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res:NextApiResponseServerIo){

    if(req.method !== 'DELETE' && req.method !== 'PATCH'){
        return res.status(400).json({error: 'Method Not Allowed'})
    }

    try {

        const profile = await currentProfileSocket(req)
        const {privatemessageId,conversationId} = req.query //Todo: 'messageId' didapat dari penamaan file ini [privatemessageId].ts
        const {content} = req.body

        if(!profile){
            return res.status(400).json({error: 'Unauthorized'})
        }

        if(!conversationId){
            return res.status(400).json({error : 'CONVERSATION ID IS NOT FOUND'})
        }

        
        const conversation = await prismaDb.conversation.findFirst({
            where : {
                id : conversationId as string,
                OR : [
                    {
                        memberOne : {
                            profileId : profile.id
                        }
                    },
                    {
                        memberTwo : {
                            profileId : profile.id
                        }
                    }
                ]
            },
            include : {
                memberOne : {
                    include : {
                        profile : true
                    }
                },
                memberTwo : {
                    include : {
                        profile : true
                    }
                }
            }
        })
        
        if(!conversation){
            return res.status(400).json({error : 'CONVERSATION IS NOT FOUND'})
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if(!member){
            return res.status(400).json({error: 'Member is Missing'})
        }

        let privatemessage = await prismaDb.privateMessage.findFirst({
            where:{
                id: privatemessageId as string,
                conversationId : conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile: true
                    }
                }
            }
        })

        if(!privatemessage || privatemessage.deleted){
            return res.status(400).json({error: 'Private Message is Missing'})
        }

        const isOwnerMessage = privatemessage.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR

        const isCanModify = isOwnerMessage || isAdmin || isModerator

        if(!isCanModify){
            return res.status(400).json({error: 'Unauthorized'})
        }

        //Delete Message
        if(req.method === 'DELETE'){
              privatemessage = await prismaDb.privateMessage.update({
              where: {
                id: privatemessageId as string
              },
              data:{
                fileUrl: null,
                content: 'This Message has been deleted',
                deleted: true
              },
              include:{
                member:{
                    include:{
                        profile: true
                    }
                }
              }
            })
        }


        //Edit Message
        if(req.method === 'PATCH'){

            if(!isOwnerMessage){
                return res.status(400).json({error: 'Unauthorized'})
            }

              privatemessage = await prismaDb.privateMessage.update({
              where: {
                id: privatemessageId as string
              },
              data:{
                content
              },
              include:{
                member:{
                    include:{
                        profile: true
                    }
                }
              }
            })
        }
        
        const updateKey = `chat:${conversation.id}:messages:update`
        
        res?.socket?.server?.io?.emit(updateKey)
        return res.status(200).json(privatemessage)

    } catch (error) {
        console.log('[PRIVATE_MESSAGE_ID]', error)
        return res.status(500).json({error: 'Internal Private_Message_ID Error'})
        
    }

}