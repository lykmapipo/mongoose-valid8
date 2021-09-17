import { model, Schema } from 'mongoose';
import '../src';

const User = model(
  'User',
  new Schema({
    email: {
      type: String,
      email: true,
    },
  })
);

const user = new User({ email: 'invalidemail' });

user.validate((error) => {
  console.log(error);
});
