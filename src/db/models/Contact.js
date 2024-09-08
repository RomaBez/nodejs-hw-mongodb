import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    email: String,
    isFavourite: {
      type: Boolean,
      require: true,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      require: true,
      default: 'personal',
    },
  },
  { versionKey: false, timestamps: true },
);

export const contactCollection = model('contact', contactSchema);
