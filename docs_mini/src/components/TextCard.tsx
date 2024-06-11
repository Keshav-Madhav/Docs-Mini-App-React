import React, { useEffect, useState, useRef } from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { LuDownload } from 'react-icons/lu'
import { motion } from "framer-motion"
import getFileSize from '../helpers/getSize'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'

type Props = {
  data: textCard,
  reference: React.RefObject<HTMLDivElement>,
  setData: React.Dispatch<React.SetStateAction<textCard[]>>
  setCount: React.Dispatch<React.SetStateAction<number>>
}

const TextCard = ({
  data,
  reference,
  setData,
  setCount,
}:Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(divRef.current && reference.current){
      // Get the dimensions of the parent div and the card itself
      const parentDimensions = reference.current.getBoundingClientRect();
      const cardDimensions = divRef.current.getBoundingClientRect();

      // Calculate random position
      const randomTop = Math.random() * (parentDimensions.height - cardDimensions.height);
      const randomLeft = Math.random() * (parentDimensions.width - cardDimensions.width);

      // Set the position state
      setPosition({ top: randomTop, left: randomLeft });
    }
  }, []);

  useEffect(() => {
    setIsVideo(ReactPlayer.canPlay(data.description));
  }, [data.description]);

  function downloadFile() {
    const blob = new Blob([data.description], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = data.title + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${data.title}`);

    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.tagDetails = {
            isOpen: true,
            tagTitle: "Downloaded",
            tagColor: "rgb(22, 163, 74)",
          };
          item.download = false;
        }
      });
      return newData;
    });
  }

  function handleDescriptionChange(e) {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight-2}px`; 
    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.description = e.target.value;

          const blob = new Blob([item.description], {type: 'text/plain'});
          item.size = getFileSize(blob.size);
          item.download = true;
          item.tagDetails = {
            isOpen: true,
            tagTitle: "Updated",
            tagColor: "rgb(37, 99, 235)",
          };
        }
      });
      return newData;
    })
  }

  function handleNameChange(e) {
    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.title = e.target.value;
          item.download = true;
          item.tagDetails = {
            isOpen: true,
            tagTitle: "Updated",
            tagColor: "rgb(37, 99, 235)",
          };
        }
      });
      return newData;
    })
  }

  function removeNote() {
    setCount((prevCount) => prevCount - 1);
    setData((prevData) => {
      const newData = prevData.filter((item) => item.id !== data.id);
      return newData;
    })
  }
  
  return (
    <motion.div 
      drag 
      dragConstraints={reference} 
      whileDrag={{scale: 1.1}} 
      dragElastic={0.3} 
      dragTransition={{
        bounceStiffness: 200, 
        bounceDamping:20
      }} 
      ref={divRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className={`absolute flex-shrink-0 flex flex-col gap-4 ${isVideo ? 'w-[98%] md:w-[50%] lg:w-[35%]' : 'w-60'} h-fit min-h-40 rounded-[40px] bg-zinc-900/90 text-white overflow-hidden`}
    >
      <div className='flex flex-col gap-4 w-full h-fit px-7 pt-8'>
        <div className='flex items-center gap-2'>
          <FaRegFileAlt className='min-w-4 h-4'/>
          <input
            className='text-md font-semibold bg-transparent outline-none text-white w-[80%] truncate'
            value={data.title}
            onChange={(e) => {
              handleNameChange(e);
            }}
          />
        </div>

        <div className='w-full h-fit flex flex-col'>
          <textarea
            className="w-full text-sm font-semibold leading-tight bg-transparent text-white outline-none resize-none overflow-hidden"
            value={data.description}
            onChange={(e) => {
              handleDescriptionChange(e);
            }}
          />

          {isVideo && (
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <ReactPlayer
                url={data.description}
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                controls={true}
                playing={false}
              />
            </div>
          )}
        </div>
      </div>

      <div className={`w-full ${!data.tagDetails.isOpen && 'mb-2'}`}>
        <div className='flex items-center justify-between py-3 px-5'>
          <h5>{data.size}</h5>
          <div className='flex items-center gap-3'>
            {data.download && (
              <motion.div 
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.2 }}
                onClick={downloadFile} 
                title='Download' 
                className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'
              >
                <LuDownload className='h-3 w-3'/>
              </motion.div>
            )}
            <motion.div 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.2 }}
              onClick={removeNote} 
              title="Remove" 
              className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'
            >
              <IoClose className='h-4 w-4'/>
            </motion.div>
          </div>
        </div>

        {data.tagDetails.isOpen && (
          <div className='w-full h-10 flex items-center justify-center' style={{backgroundColor: data.tagDetails.tagColor}}>
            <h3 className='text-sm font-semibold'>{data.tagDetails.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TextCard