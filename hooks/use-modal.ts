import { Channel, ChannelType, Server } from '@prisma/client';
import {create} from 'zustand'

export type ModalType = 'createServer' | 'invite' | 'editingServer' | 'member' | 'createChannel' | 'leaveServer' | 'deleteServer' |
                        'deleteChannel' | 'editChannel' | 'messageFile'

interface ModalData{
    server? : Server
    channel?: Channel
    channelTypeValue?: ChannelType  //Todo: Ditambah karena ingin create default value form 'server-member'
    apiUrl? : string //Todo: messageFile
    query? : Record<string,any> //Todo: messageFile
}
 
interface ModalStore {
    type: ModalType | null
    data: ModalData
    isOpen: boolean;
    onOpen: (type: ModalType , data? : ModalData) => void
    onClose: () => void
}

export const useModalStores = create<ModalStore>((set) => ({
    type:null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen:true, type, data}),
    onClose: () => set({type:null, isOpen: false})
})) 

 