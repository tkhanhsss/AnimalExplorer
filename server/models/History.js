import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    wikipedia: {
      title: String,
      extract: String,
      pageUrl: String,
    },
  },
  { timestamps: true },
);

const History = mongoose.model("History", historySchema);
export default History;
