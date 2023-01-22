const mongoose = require("mongoose");

const voteHistorySchema = new mongoose.Schema({
  foriegnMenuId: {
    type: String,
  },
  foriegnUserId: {
    type: String,
  },
  status: {
    type: Number,
    default: 0,
    enum: [0, 1],
  },
});

const VoteHistory = mongoose.model("voteHistory", voteHistorySchema);

module.exports = VoteHistory;
