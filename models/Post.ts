// Post
export interface Post {
  id: string;
  userLogin: string;
  title: string;
  url: string;
  slug: string;
  content: string;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
