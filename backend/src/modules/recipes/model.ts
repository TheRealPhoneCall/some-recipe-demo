import mongoose, { Schema, Document } from 'mongoose'
import { IImg } from '../files/model'
import { IUserMin } from '../user/model'

export interface IRecipeStep {
  step: number;
  desc: string;
  photo?: IImg;
}

export interface IRecipe extends Document {
  name: string;
  desc: string;
  type: string;
  creator: IUserMin;
  ingredients: string[];
  rating?: number;
  steps: IRecipeStep[];
  usersLiked: IUserMin[];
  usersLikedIds: string[];
  photo?: IImg;
  photos?: IImg[];
}

const RecipeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    type: { type: String, required: true },
    creator: { type: Object, required: true },
    ingredients: { type: Array, required: true },
    steps: { type: Array, required: true },
    rating: { type: Number, required: false },
    usersLiked: { type: Array, required: true },
    usersLikedIds: { type: Array, required: true },
    photo: { type: Object, required: false },
    photos: { type: Array, required: false },
  }, 
  { timestamps: true }
)

export default mongoose.model<IRecipe>('Recipe', RecipeSchema)