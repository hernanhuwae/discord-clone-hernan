import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { NavigationSidebar } from "./navigation/navigation-sidebar"
import { ServerSidebar } from "./servers/server-sidebar"
import {VisuallyHidden} from '@radix-ui/react-visually-hidden'

export const MobileToggle = ({serverId}:{serverId:string})=> {

    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className="md:hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className="flex gap-0 p-0">
                <VisuallyHidden>
                    <SheetTitle></SheetTitle>
                </VisuallyHidden>
                <div className="w-[72px]">
                    <NavigationSidebar/>
                </div>
                <ServerSidebar serverId={serverId}/>
            </SheetContent>
        </Sheet>
    )
}