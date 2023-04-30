import { ObjectId, Schema, model } from "mongoose";

export interface TouiteProps extends Document {
  text: string;
  author: ObjectId;
}

const TouiteSchema = new Schema<TouiteProps>({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
},
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    }
  }
);

const Touite = model<TouiteProps>("Touite", TouiteSchema)

export default Touite
