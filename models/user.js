const mongoose = require('mongoose'),
  validator = require('validator'),
  bcryptjs = require('bcryptjs'),
  jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      type: String,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error('Invalid email address!!');
        }
      }
    },
    password: {
      required: true,
      trim: true,
      minlength: 6,
      type: String,
      validate(pwd) {
        if (pwd.toLowerCase().includes('password')) {
          throw new Error("Password cannot contain 'password'!!");
        }
      }
    },
    tokens: [{ token: { type: String, required: true } }]
  },
  { timestamps: true }
);

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY, {
    expiresIn: '1h'
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No such user exists');
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }
  return user;
};

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(
      new Error(
        'The provided email is already in use by an existing user. Each user must have a unique email.'
      )
    );
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
