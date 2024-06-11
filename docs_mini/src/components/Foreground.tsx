import React from "react"
import { useDropzone } from "react-dropzone"
import { useEffect, useState, useRef } from "react"
import { mainStore } from './mainStore'
import AddNewCard from "./AddNewCard"
import TextCard from "./TextCard"
import AudioCard from "./AudioCard"
import VideoCard from "./VideoCard"
import { AnimatePresence } from "framer-motion"
import getFileSize from "../helpers/getSize"

function Foreground() {
  const ref = useRef(null)
  const [textData, setTextData] = useState<textCard[]>([])
  const [audioData, setAudioData] = useState<audioCard[]>([])
  const [videoData, setVideoData] = useState<videoCard[]>([])
  const [uploadedFile, setUploadedFile] = useState<File>()
  const { setIsDrag } = mainStore();
  const [count, setCount] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    accept: { 'text/plain': ['.txt'], 'audio/mpeg': ['.mp3'], 'video/mp4': ['.mp4'] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        setCount(count + 1);
      } 
    },
  });

  useEffect(() => {
    setIsDrag(isDragActive);
  }
  , [isDragActive]);

  useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if(e.target?.result) {
          const content = e.target.result;
          const title = uploadedFile.name.split(".")[0];
          const size = getFileSize(uploadedFile.size);
          const tagDetails = {
            isOpen: true,
            tagTitle: "New",
            tagColor: "rgb(232,145,47)",
          };
          const download = true;
          const id = count;
  
          // Check the file type
          if (uploadedFile.type === 'text/plain') {
            const description = content.toString().slice(0, 100);
            setTextData((prevData) => {
              const newData = [...prevData];
              newData.push({
                title,
                size,
                description,
                tagDetails,
                download,
                id,
              });
              return newData;
            });
          } else if (uploadedFile.type === 'audio/mpeg') {
            const audioBlob = new Blob([content], { type: 'audio/mpeg' });
            setAudioData((prevData) => {
              const newData = [...prevData];
              newData.push({
                title,
                size,
                audioBlob,
                tagDetails,
                download,
                id,
              });
              return newData;
            });
          } else if (uploadedFile.type === 'video/mp4') {
            const videoBlob = new Blob([content], { type: 'video/mp4' });
            setVideoData((prevData) => {
              const newData = [...prevData];
              newData.push({
                title,
                size,
                videoBlob,
                tagDetails,
                download,
                id,
              });
              return newData;
            });
          }
        }
      };
  
      // Read the file based on its type
      if (uploadedFile.type === 'text/plain') {
        reader.readAsText(uploadedFile);
      } else if (uploadedFile.type === 'audio/mpeg') {
        reader.readAsArrayBuffer(uploadedFile);
      } else if (uploadedFile.type === 'video/mp4') {
        reader.readAsArrayBuffer(uploadedFile);
      }
    }
  }, [uploadedFile]);

  return (
    <div 
      {...getRootProps()}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
      className="fixed z-[3] w-full h-full top-0 left-0"
    >
      <input
        {...getInputProps()}
        type="file"
        name="UploadFiles"
        id="UploadFiles"
        tabIndex={-1}
        className="hidden"
      />


      <div ref={ref} className="fixed w-full h-full flex gap-3 flex-wrap p-4">
        {(textData.length < ((window.innerWidth * window.innerHeight) / (240*160*2))) && (
          <AddNewCard 
            setTextData={setTextData} 
            setAudioData={setAudioData}
            setVideoData={setVideoData}
            reference={ref} 
            setCount={setCount} 
            count={count}
          />
        )}
        <AnimatePresence>
          {textData.map((item) => (
            <TextCard
              key={item.id}
              data={item}
              reference={ref}
              setData={setTextData}
              setCount={setCount}
            />
          ))}

          {audioData.map((item) => (
            <AudioCard
              key={item.id}
              data={item}
              reference={ref}
              setData={setAudioData}
              setCount={setCount}
            />
          ))}

          {videoData.map((item) => (
            <VideoCard
              key={item.id}
              data={item}
              reference={ref}
              setData={setVideoData}
              setCount={setCount}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Foreground