import Card from "./Card"
import { useRef, useState } from "react"

function Foreground() {
  const ref = useRef(null)
  const [data, setData] = useState([
    {
      title: "File 1",
      size: "0.4mb",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      tagDetails: {
        isOpen: false,
        tagTitle: "Download Now",
        tagColor: "rgb(22, 163, 74)",
      },
      download: false,
    },
    {
      title: "File 2",
      size: "0.3mb",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      tagDetails: {
        isOpen: true,
        tagTitle: "Download Now",
        tagColor: "rgb(22, 163, 74)",
      },
      download: true,
    },
    {
      title: "File 3",
      size: "0.5mb",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      tagDetails: {
        isOpen: false,
        tagTitle: "Upload",
        tagColor: "rgb(37, 99, 235)",
      },
      download: false,
    },
    {
      title: "File 4",
      size: "0.6mb",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      tagDetails: {
        isOpen: false,
        tagTitle: "Upload",
        tagColor: "rgb(37, 99, 235)",
      },
      download: false,
    },
    {
      title: "File 5",
      size: "0.7mb",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      tagDetails: {
        isOpen: true,
        tagTitle: "Upload",
        tagColor: "rgb(37, 99, 235)",
      },
      download: true,
    },
  ])
  return (
    <div ref={ref} className="fixed z-[3] w-full h-full top-0 left-0 flex gap-6 flex-wrap p-5">
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
  )
}

export default Foreground