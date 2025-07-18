import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const {userId} = await auth()
    if(!userId) throw new Error ("Unauthorized")
    return{userId:userId}
}



// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({image: {maxFileSize:'4MB', maxFileCount: 1 }}).middleware(()=>handleAuth())
  .onUploadComplete(()=>{}),
  messageFile: f(['image', 'pdf']).middleware(()=> handleAuth())
  .onUploadComplete((res)=>{
    
  })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
