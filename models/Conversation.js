const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ObjectId } = mongoose.Schema;

const MessagesSchema = new Schema(
  {
    sender: {
      type: ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        type: ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true }
);
const Conversation = mongoose.model('Conversation', ConversationSchema);
const Messgae = mongoose.model('Message', MessagesSchema);
exports.Conversation = Conversation;
exports.Message = Messgae;
