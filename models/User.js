const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      text: true,
      unique: true,
    },
    password: {
      type: String,
    },
    conversations: [
      {
        type: ObjectId,
        ref: 'Conversation',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
