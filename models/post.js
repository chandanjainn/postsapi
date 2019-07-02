const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
