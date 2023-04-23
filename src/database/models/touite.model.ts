import { Schema, model } from "mongoose";

export interface TouiteProps {
  text: string;
  author: string;
}

const TouiteSchema = new Schema<TouiteProps>({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  }
},
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    }
  }
);

const Touite = model("touite", TouiteSchema)

export default Touite
