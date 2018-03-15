const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema({
  name: String,
  email: String,
  hashed_password: String,
  salt: String,
});

/**
 * Methods
 */

UserSchema.method({

});

/**
 * Statics
 */

UserSchema.static({

});

module.exports = mongoose.model('User', UserSchema);
