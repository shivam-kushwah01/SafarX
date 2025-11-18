const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    createdAt: {
        type: Date,
        default: Date.now,
        // TTL index: document will be removed 24 hours after createdAt
        expires: 60 * 60 * 24
    }
});

blacklistTokenSchema.index({ token: 1 });

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);