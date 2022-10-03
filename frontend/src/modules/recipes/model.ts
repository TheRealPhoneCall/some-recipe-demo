import { IImg } from 'src/modules/images/model'
import { IUserMin } from 'src/modules/auth/model'

export interface IRecipeStep {
  step: number;
  desc: string;
  photo?: IImg;
}

export interface IRecipe {
  _id: string | null;
  name: string;
  desc: string;
  type: string;
  creator: IUserMin;
  ingredients: string[];
  steps: IRecipeStep[];
  rating: number;
  usersLiked: IUserMin[];
  usersLikedIds: string[];
  photo?: IImg;
  photos?: IImg[];
}

export interface IRecipeMin {
  _id: string;
  name: string;
  desc: string;
  type: IImg;
  creator: IUserMin;
}

export const recipeDefault = () => ({
  _id: null,
  name: '',
  desc: '',
  type: '',
  creator: {} as IUserMin,
  ingredients: [],
  steps: [] as IRecipeStep[],
  rating: 0,
  usersLiked: [] as IUserMin[],
  usersLikedIds: [] as string[],
  photo: {} as IImg,
  photos: [] as IImg[]
} as IRecipe)
