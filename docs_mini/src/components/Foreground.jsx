import Card from "./Card"
import { useDropzone } from "react-dropzone"
import { useEffect, useState, useRef } from "react"
import { mainStore } from './mainStore'

function Foreground() {
  const ref = useRef(null)
  const [data, setData] = useState([])
  const [uploadedFile, setUploadedFile] = useState()
  const { setIsDrag } = mainStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    accept: { 'text/plain': ['.txt'] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
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
      reader.onload = (e) => {
        const content = e.target.result;
        const title = uploadedFile.name.split(".")[0];
        const size = uploadedFile.size / 1000 + " KB";
        const description = content.slice(0, 100);
        const tagDetails = {
          isOpen: true,
          tagTitle: "Download",
          tagColor: "rgb(22, 163, 74)", // rgb(37, 99, 235) rgb(22, 163, 74) rgb(232,145,47)
        };
        const download = true;
        setData((prevData) => [
          ...prevData,
          { title, size, description, tagDetails, download },
        ]);
      };
      reader.readAsText(uploadedFile);
    }

    console.log(uploadedFile);
  }
  , [uploadedFile]);

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

      <div ref={ref} className="fixed w-full h-full flex gap-6 flex-wrap p-5">
        {data.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            size={item.size}
            description={item.description}
            tagDetails={item.tagDetails}
            download={item.download}
            reference={ref}
            setData={setData}
          />
        ))}
      </div>
    </div>
  )
}

export default Foreground