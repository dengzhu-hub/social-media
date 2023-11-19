import { fileUpload } from '@/public/assets/icons';
import React, { useState, useCallback } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Button } from '../ui/button';
interface FileUploadProps {
  fileChange: (file: File[]) => void;
  mediaUrl: string;
}
const FileUpload = ({ fileChange, mediaUrl }: FileUploadProps) => {
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {

    // Do something with the files
    console.log(acceptedFiles);
    setFile(acceptedFiles);
    fileChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, [fileChange])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],


    }
  });


  return (
    <div {...getRootProps()} className='flex flex-center gap-4 bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl ?
          (
            <>
              <div className='flex flex-1 justify-center p-5 w-full lg:p-10'>
                <img src={fileUrl} className='file_uploader-img' alt="this is not seen" />
              </div>
              {/* <p className='file_uploader-label'>click or drag photo to replace</p> */}
            </>
          ) : (
            <div className='file_uploader-box'>
              <img src={fileUpload} width={96} height={77} alt="file uploader" />
              <h3 className='base-medium text-light-2 mb-2 mt-6'>drag photo here</h3>
              <p className='text-light-3 small-regular mb-6 uppercase'>svg png jpg</p>
              <Button className='shad-button_dark_4 capitalize'>select from computer</Button>
            </div>
          )

      }
    </div>
  )
}

export default FileUpload