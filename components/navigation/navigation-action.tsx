"use client"

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModalStores } from "@/hooks/use-modal";

export const NavigationAction = () => {

    //Todo:  Buat aktifkan fungsi Modal create server dari komponen hooks modal store, modal provider, dan createServerModal
    const {onOpen} = useModalStores()

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add server">
        <button onClick={()=>onOpen('createServer')} className="group flex items-center">
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px]
                    transition-all overflow-hidden items-center justify-center bg-gray-950 dark:bg-neutral-700
                    group-hover:bg-emerald-500"
          >
            <Plus
              size={30}
              className="group-hover:text-white transition  text-emerald-500"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
