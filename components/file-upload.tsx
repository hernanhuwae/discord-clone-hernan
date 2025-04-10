'use client'

import { UploadDropzone } from "@/lib/uploadthing"
import '@uploadthing/react/styles.css'
import { FileIcon, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface IFileUpload {
    onChange: (url?: string) => void
    value: string
    endPoint: 'serverImage' | 'messageFile'
}

export const FileUpload: React.FC<IFileUpload> = ({onChange, value, endPoint}) => {
    // State untuk melacak tipe file
    const [isPdf, setIsPdf] = useState<boolean>(false);
    
    // Periksa apakah file adalah PDF ketika nilai berubah
    useEffect(() => {
        if (value) {
            // Cek ekstensi file dari URL
            const fileNameParts = value.split('/').pop()?.split('.') || [];
            const extension = fileNameParts.length > 1 ? fileNameParts.pop()?.toLowerCase() : '';
            
            // Set isPdf berdasarkan ekstensi
            setIsPdf(extension === 'pdf');
        } else {
            setIsPdf(false);
        }
    }, [value]);

    // Jika file adalah PDF
    if (value && isPdf) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                <a 
                    href={value}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value.split('/').pop() || 'PDF Document'}
                </a>
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-3 w-3"/>
                </button>
            </div>
        )
    }

    // Jika file bukan PDF (gambar)
    if (value && !isPdf) {
        return(
            <div className="relative h-20 w-20">
                <Image 
                    fill 
                    src={value} 
                    alt="Upload" 
                    className="rounded-full"
                    onError={() => {
                        // Jika gambar gagal dimuat, kemungkinan ini adalah PDF
                        console.log("Image loading failed, treating as PDF");
                        setIsPdf(true);
                    }}
                />
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-3 w-3"/>
                </button>
            </div>
        )
    }

    // Jika tidak ada value (upload awal)
    return (
        <UploadDropzone
            endpoint={endPoint}
            onClientUploadComplete={(res) => {
                console.log("Upload complete:", res);
                
                if (res && res[0]) {
                    const fileName = res[0].name || '';
                    const isPdfFile = fileName.toLowerCase().endsWith('.pdf');
                    
                    console.log("File name:", fileName);
                    console.log("Is PDF:", isPdfFile);
                    
                    // Set state dan pasang URL
                    setIsPdf(isPdfFile);
                    onChange(res[0].ufsUrl);
                }
            }}
            onUploadError={(error: Error) => {
                console.log("Upload error:", error);
            }}
        />
    )
}

