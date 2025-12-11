export type UsersMetadata = {
  hobbies: string[];
  nationality: string;
};

export type User = {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
} & UsersMetadata;
