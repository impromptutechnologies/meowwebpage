const mongoose = require("mongoose");
const investSchema = new mongoose.Schema({
  creatorID: { type: String, required: true },
  serverID: { type: String, required: false },
  channelID: { type: String, required: false },
  category: { type: String, required: true },
  creatorName: { type: String, required: true },
  change: { type: Number, required: false },
  status: { type: String, required: true},
  investAmount: { type: Number, required: true },
  percentile: { type: Number, required: false },
  Code: { type: String, required: true },
});
const Invest = mongoose.model("Invest", investSchema);

module.exports = Invest;
