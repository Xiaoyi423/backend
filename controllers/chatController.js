const User = require('../models/User');
const { Conversation, Message } = require('../models/Conversation');

exports.getConvo = async (req, res) => {
  try {
    const conversation = await Conversation.findOne(req.params.id).populate({
      path: 'messages',
      populate: { path: 'sender', model: 'User', select: 'username name' },
    });
    if (!conversation) {
      res.status(404).send({ msg: 'Conversation not found' });
    } else {
      if (conversation.participants.includes(req.decoded._id)) {
        res.send({ conversation });
      } else {
        res.status(401).send({ msg: 'Unauthorized access' });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.sendMsg = async (req, res) => {
  const user1 = req.decoded.id;
  const user2 = req.body.id;
  try {
    const convo = await Conversation.find({
      participants: { $all: [user1, user2] },
    });
    if (convo.length == 0) {
      const newConvo = new Conversation({
        participants: [user1, user2],
      });
      if (req.body.content) {
        const msg = {
          sender: user1,
          content: req.body.content,
        };
        const newMessage = await Message.create(msg);
        newConvo.messages.push(newMessage);
      }
      const userA = await User.findById(user1);
      const userB = await User.findById(user2);
      newConvo.save();
      userA.conversations.push(newConvo);
      userA.save();
      userB.conversations.push(newConvo);
      userB.save();
    } else if (convo.length == 1) {
      const newMsg = {
        sender: user1,
        content: req.body.content,
      };
      const addMsg = await Message.create(newMsg);
      convo[0].messages.push(addMsg);
      convo[0].save();
    }
    res.send({ msg: 'messsage sent' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
