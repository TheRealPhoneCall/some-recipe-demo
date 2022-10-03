import mongoose, { Schema, Document } from 'mongoose'

export interface IRecipeStep extends Document {
  number: number;
  desc: string;
  photo?: string;
  recipeId: string;
}

const RecipeStepSchema: Schema = new Schema(
  {
    number: { type: Number, required: true },
    desc: { type: String, required: true },
    photo: { type: String, required: false },
    recipeId: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IRecipeStep>('RecipeStep', RecipeStepSchema)