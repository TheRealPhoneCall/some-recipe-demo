import mongoose, { Schema, Document } from 'mongoose'

export interface IImg {
  _id: string;
  path: string;
}

export interface IUpload extends Document {
  type: string;
  name: string;
  uploader: string;
  filterType?: string;
  filterId?: string;
  path: string;
}

const UploadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    uploader: { type: String, required: true },
    filterType: { type: String, required: false },
    filterId: { type: String, required: false },
    path: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IUpload>('Upload', UploadSchema)