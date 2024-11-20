/** @format */

export interface CV {
  _id: string;
  name: string;
  description: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  _id: string;
  name: string;
  email: string;
}
