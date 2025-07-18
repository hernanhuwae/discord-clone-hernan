"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { DialogTitle } from "../ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


interface IServerSearch {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          id: string;
          icon: React.ReactNode;
          name: string;
          
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: IServerSearch) => {
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const params = useParams()

  //Todo : to <CommandItem/>
  const onClick = ({id, type} : {id: string, type: 'channel' | 'member'}) => {

    setOpen(false)

    if(type === 'member'){
      return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
    
    if(type === 'channel'){
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  } 

  useEffect(()=>{

    const down = (e: KeyboardEvent) => {
      if(e.key === 'k' && (e.metaKey || e.ctrlKey))
      {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener ('keydown', down)
    
  },[])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center px-2 py-2 rounded-md gap-x-2 w-full 
            hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition "
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 
                group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
        >
          Search
        </p>
        <kbd
          className="pointer-events-none inline-flex h-5 select-none items-center
                gap-1 rounded border bg-muted text-[10px] font-medium text-muted-foreground ml-auto max-md:hidden"
        >
          <span className="text-xs">Ctrl</span>+ K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <CommandInput placeholder="Search All Channels or Members"/>
        <CommandList>
          <CommandEmpty>
            No Result!
          </CommandEmpty>

          {data.map(({label,data,type})=>{
            if(!data?.length) return null
            
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({id,icon,name})=>{
                  return(
                    <CommandItem key={id} onSelect={()=> onClick({id,type})}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}

        </CommandList>
      </CommandDialog>
    </>
  );
};
