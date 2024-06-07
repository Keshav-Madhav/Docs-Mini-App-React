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