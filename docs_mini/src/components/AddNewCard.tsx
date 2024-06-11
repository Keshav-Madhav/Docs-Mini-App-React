import React, { useState } from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import { motion } from "framer-motion";
import { PiPlusCircle } from 'react-icons/pi';

const AddNewCard = ({
  reference,
  setTextData,
  setAudioData,
  setVideoData,
  setCount,
  count,
}) => {
  const [tempData, setTempData] = useState({ title: 'New' });
  const types = ['Text', 'Video', 'Audio'];
  const [typeIndex, setTypeIndex] = useState(0);
  const type = types[typeIndex];

  function addNew() {
    if(type === 'Text') {
      setTextData((prevData) => {
        const newData = [...prevData];
        newData.push({
          title: tempData.title,
          size: '0 KB',
          description: '',
          tagDetails: {
            isOpen: true,
            tagTitle: 'New',
            tagColor: 'rgb(232,145,47)',
          },
          download: false,
          id: count,
        });
        return newData;
      });
    } else if(type === 'Audio') {
      setAudioData((prevData) => {
        const newData = [...prevData];
        newData.push({
          title: tempData.title,
          size: '0 KB',
          audioBlob: new Blob(),
          tagDetails: {
            isOpen: true,
            tagTitle: 'New',
            tagColor: 'rgb(232,145,47)',
          },
          download: false,
          id: count,
        });
        return newData;
      });
    } else if(type === 'Video') {
      setVideoData((prevData) => {
        const newData = [...prevData];
        newData.push({
          title: tempData.title,
          size: '0 KB',
          videoBlob: new Blob(),
          tagDetails: {
            isOpen: true,
            tagTitle: 'New',
            tagColor: 'rgb(232,145,47)',
          },
          download: false,
          id: count,
        });
        return newData;
      });
    }
    setCount((prevCount) => prevCount + 1);
    setTempData({ title: 'New' });
  }

  function cycleType() {
    setTypeIndex((prevIndex) => (prevIndex + 1) % types.length);
  }

  return (
    <motion.div 
      drag 
      dragConstraints={reference} 
      whileDrag={{ scale: 1.1 }} 
      dragElastic={0.3} 
      dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }} 
      className="relative flex-shrink-0 flex flex-col gap-3 w-[12.5rem] h-[11rem] rounded-[40px] bg-zinc-900/90 text-white overflow-hidden"
    >
      <div className='flex flex-col gap-3 w-full h-full px-6 pt-5'>
        <div className='flex items-center gap-2'>
          <FaRegFileAlt className='min-w-4 h-4'/>
          <input
            className='text-md font-semibold bg-transparent outline-none text-white w-[80%] truncate'
            value={tempData.title}
            onChange={(e) => {
              setTempData({ title: e.target.value });
            }}
          />
        </div>
        
        <div className='h-full w-full flex items-center justify-center'>
          <motion.span whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.2 }} onClick={addNew} className='w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-400 cursor-pointer'>
            <PiPlusCircle className='w-12 h-12'/>
          </motion.span>
        </div>
      </div>

      <div className='w-full'>
        <motion.div 
          whileHover={{ scale: 1.04}}
          whileTap={{ scale: 1 }}
          onClick={cycleType}
          className='w-full h-10 flex items-center justify-center cursor-pointer bg-[rgb(147,112,219)] hover:bg-[rgb(105,77,162)] transition-colors' 
          style={{ backgroundColor: "" }}
        >
          <h3 className='text-sm font-semibold'>Add New {type}</h3>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AddNewCard;
