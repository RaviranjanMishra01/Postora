const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "image/jpeg",
    },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);
module.exports = Media;
