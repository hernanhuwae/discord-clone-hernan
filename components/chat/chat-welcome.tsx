"use client";

import { Hash } from "lucide-react";

interface IChatWelcome {
  name: string;
  type: "channel" | "conversation";
}

export const ChatWelcome = ({ name, type }: IChatWelcome) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div
          className="h-[75px] w-[75px] flex items-center justify-center rounded-full 
                bg-zinc-500 dark:bg-zinc-700 "
        >
          <Hash className="h-10 w-10 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome To #" : ""}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `Ayo mulai obrolanmu di #${name} channel`
          : `Mulai obrolan dengan ${name}`}
      </p>
    </div>
  );
};
