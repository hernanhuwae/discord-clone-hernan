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
import qs from 'query-string'


export const DeletePrivateMessageModal = () => {

  const [ isLoading, setIsLoading] = useState(false)
  const {isOpen, onClose ,type, data} = useModalStores()
  const { apiUrl,query} = data
  const isModalOpen = isOpen && type === "deleteMessagePrivate"

  const onClick = async () => {

    try {

      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl || '',    //Todo: kenapa use 'apiUrl' karena saat sudah hapus message kita harus get all message lagi di API ('api/messages') dan tertera value akhir setelah dari onClick <Trash/> nanti di page channelId
        query                 //Todo: value 'apiUrl' dan 'query' diisi di onClick <Trash/> chat-bubble.tsx
      })
      await axios.delete(url)
      onClose()
    
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure to delete your own message ?
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


