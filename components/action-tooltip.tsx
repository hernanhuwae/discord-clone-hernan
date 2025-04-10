'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface IActionTooltip {
    label: string
    children: React.ReactNode
    side? : 'top' | 'bottom' | 'left' | 'right'
    align? : 'start' | 'center' | 'end'
}

export const ActionTooltip:React.FC<IActionTooltip> = ({label,children,side,align})=>{
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold capitalize text-sm">
                        {label.toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}