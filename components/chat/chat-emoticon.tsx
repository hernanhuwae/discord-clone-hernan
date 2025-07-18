"use client";

import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import {useTheme} from 'next-themes'

interface IEmoticonMessage {
  onChange: (value: string) => void;
}

export const EmoticonMessage = ({ onChange }: IEmoticonMessage) => {

    const {resolvedTheme} = useTheme()

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Smile className="text-zinc-500 dark:text-zinc-400 dark:hover:text-emerald-700 hover:text-blue-600 transition" />
        </PopoverTrigger>
        <PopoverContent     
            side="right"    
            sideOffset={40} 
            className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        >
            <Picker
                theme= {resolvedTheme}
                data= {data}
                onEmojiSelect= {(emoji:any)=> onChange(emoji.native)}
            />


        </PopoverContent>
      </Popover>
    </>
  );
};
