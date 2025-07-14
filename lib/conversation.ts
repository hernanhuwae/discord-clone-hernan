import { prismaDb } from "./db";


export const getOrCreateConversation = async(memberOneId:string, memberTwoId:string) => {
  
    let conversation = await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId)


    if(!conversation){
        conversation = await createNewConversation(memberOneId,memberTwoId)
    }

    return conversation

}


//Todo : Relate sama tabel db 'Conversation' => @@unique([memberOneId, memberTwoId])
//Todo : Biar tidak ada duplikat conversationId antara memberOne and memberTwo

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prismaDb.conversation.findFirst({
      where: {
        OR: [
          {
            memberOneId: memberOneId,
            memberTwoId: memberTwoId
          },
          {
            memberOneId: memberTwoId,
            memberTwoId: memberOneId
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await prismaDb.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
