import { currentProfileSocket } from "@/lib/current-profile-socket";
import { prismaDb } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponseServerIo){

    if(req.method !== 'POST'){
        return res.status(405).json({error : 'METHOD NOT ALLOWED'})
    }

    try {

        const profile = await currentProfileSocket(req)
        const {content,fileUrl} = req.body  //Todo: Field tabel database Message
        const {serverId,channelId} = req.query  

        if(!profile){
            return res.status(400).json({error: 'Unauthorized'})
        }

        if(!serverId){
            return res.status(400).json({error: 'Server ID Is Missing!'})
        }
        
        if(!channelId){
            return res.status(400).json({error: 'Channel ID Is Missing!'})
        }

        if(!content){
            return res.status(400).json({error: 'Content Is Missing!'})
        }

        const server = await prismaDb.server.findFirst({
            where: {
                id: serverId as string,
                Member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include:{
                Member: true
            }
        })

        if(!server){
            return res.status(404).json({error: 'SERVER NOT FOUND'})
        }

        const channel = await prismaDb.channel.findFirst({
            where:{
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if(!channel){
            return res.status(404).json({error: 'CHANNEL NOT FOUND'})
        }

        const member = server.Member.find((members)=> members.profileId === profile.id)

        if(!member){
            return res.status(404).json({error: 'MEMBER NOT FOUND'})
        }

        const message = await prismaDb.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include: {
                member :{
                    include:{
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`
        res?.socket?.server?.io?.emit(channelKey, message)
        return res.status(200).json(message)

    } catch (error) {
        console.log('[MESSAGE_ERROR]', error);
        return res.status(500).json({message: 'MESSAGE_ERROR_API'})
        
    }

}