import { ImageProps } from '../images/image-props.model';

export interface Post {
  title: string;
  author: string;
  authorId: string;
  content: string;
  description: string;
  keywords: string;
  modifiedDate: number;
  published?: boolean;
  publishedDate?: number;
  imageProps?: ImageProps;
  id?: string;
  imagesUpdated?: Date;
  imageSizes?: number[];
  imageFilePathList?: string[];
  videoUrl?: string;
  featured?: boolean;
  readyToPublish?: boolean;
}

