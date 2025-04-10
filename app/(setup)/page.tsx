import { InitialModal } from "@/components/modals/initial-modal"
import { prismaDb } from "@/lib/db"
import { InitialProfile } from "@/lib/initial-profile"
import { redirect } from "next/navigation"

const SetupPage = async () => {

    const profile = await InitialProfile()

    const server = await prismaDb.server.findFirst({
      where:{
        Member:{
          some:{
            profileId: profile.id
          }
        }
      }
    })

    if(server){
      return redirect(`/servers/${server.id}`)
    }

  return <InitialModal/>
}

export default SetupPage