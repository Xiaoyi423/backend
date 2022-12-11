const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const PostSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
