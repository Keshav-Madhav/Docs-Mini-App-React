type textCard = {
  title: string;
  size: string;
  description: string;
  tagDetails: {
    isOpen: boolean;
    tagTitle: string;
    tagColor: string;
  };
  download: boolean;
  id: number;
};

type audioCard = {
  title: string;
  size: string;
  audioBlob: Blob;
  tagDetails: {
    isOpen: boolean;
    tagTitle: string;
    tagColor: string;
  };
  download: boolean;
  id: number;
};

type videoCard = {
  title: string;
  size: string;
  videoBlob: Blob;
  tagDetails: {
    isOpen: boolean;
    tagTitle: string;
    tagColor: string;
  };
  download: boolean;
  id: number;
};