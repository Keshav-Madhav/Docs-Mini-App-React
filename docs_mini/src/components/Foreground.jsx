import Card from "./Card"
import { useDropzone } from "react-dropzone"
import { useEffect, useState, useRef } from "react"

function Foreground() {
  const ref = useRef(null)
  const [data, setData] = useState([])

  const [uploadedFiles, setUploadedFiles] = useState([])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    accept: { 'text/plain': ['.txt'] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFiles([...uploadedFiles, acceptedFiles[0]]);
      } 
    },
  });

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const title = file.name.split(".")[0];
          const size = file.size;
          const description = content.slice(0, 100);
          const tagDetails = {
            isOpen: true,
            tagTitle: "New",
            tagColor: "rgb(232,145,47)", // rgb(37, 99, 235) rgb(22, 163, 74)
          };
          const download = true;
          setData((prevData) => [
            ...prevData,
            { title, size, description, tagDetails, download },
          ]);
        };
        reader.readAsText(file);
      });
    }

    console.log(uploadedFiles);
  }
  , [uploadedFiles]);

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
          />
        ))}
      </div>
    </div>
  )
}

export default Foreground