"use client";

 
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModalStores } from "@/hooks/use-modal";
import { Button } from "../ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from 'query-string'



export const DeleteChannelModal = () => {

  const [ isLoading, setIsLoading] = useState(false)
  const {isOpen, onClose ,type, data} = useModalStores()
  const { channel, server} = data
  const isModalOpen = isOpen && type === "deleteChannel"
  const router = useRouter()
  const params= useParams() //todo: bisa pakai params?.serverId bagian query qs dan di router push()

  const onClick = async () => {

    try {

      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query : {
          serverId : server?.id
        }
      })
      await axios.delete(url)
      onClose()
      router.replace(`/servers/${server?.id}`)
      router.refresh()

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }

  }

  
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-5">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure to delete <span className="text-red-500 font-semibold">{channel?.name}</span> Channel?
          </DialogDescription>
        </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                  <Button disabled={isLoading} onClick={onClose} variant='ghost'>
                    Cancel
                  </Button>
                  <Button disabled={isLoading} onClick={onClick} variant='destructive'>
                    Confirm
                  </Button>
              </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


