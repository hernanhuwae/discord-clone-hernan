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
        const {messageId, serverId, channelId} = req.query //Todo: 'messageId' didapat dari penamaan file ini [messageId].ts
        const {content} = req.body

        if(!profile){
            return res.status(400).json({error: 'Unauthorized'})
        }

        if(!serverId){
            return res.status(400).json({error: 'Server ID Is Missing'})
        }

        if(!channelId){
            return res.status(400).json({error: 'Channel ID Is Missing'})
        }

        const server = await prismaDb.server.findFirst({
            where:{
                id: serverId as string,
                Member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                Member: true  //Todo: Butuh member karena nantinya server membutuhkan member agar bisa ambil profile ID tiap user yang terdaftar di server untuk relasi ke tabel Message (untuk PATCH/DELETE) agar kita bisa Edit/Delete message tertentu
            }
        })

        if(!server){
            return res.status(400).json({error: 'Server is Missing'})
        }

        const channel = await prismaDb.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if(!channel){
            return res.status(400).json({error: 'Channel is Missing'})
        }

        const member = server.Member.find((members)=> members.profileId === profile.id)

        if(!member){
            return res.status(400).json({error: 'Member is Missing'})
        }

        let message = await prismaDb.message.findFirst({
            where:{
                id: messageId as string,
                channelId: channelId as string
            },
            include:{
                member:{
                    include:{
                        profile: true
                    }
                }
            }
        })

        if(!message || message.deleted){
            return res.status(400).json({error: 'Message is Missing'})
        }

        const isOwnerMessage = message.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR

        const isCanModify = isOwnerMessage || isAdmin || isModerator

        if(!isCanModify){
            return res.status(400).json({error: 'Unauthorized'})
        }

        //Delete Message
        if(req.method === 'DELETE'){
              message = await prismaDb.message.update({
              where: {
                id: messageId as string
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

              message = await prismaDb.message.update({
              where: {
                id: messageId as string
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
        
        const updateKey = `chat:${channelId}:message:update`
        
        res?.socket?.server?.io?.emit(updateKey,message)
        return res.status(200).json(message)

    } catch (error) {
        console.log('[MESSAGE_ID]', error)
        return res.status(500).json({error: 'Internal Message_ID Error'})
        
    }

}