import Joi from 'joi';
import { contactTypeList, phoneNumberPattern } from '../constants/contacts.js';

export const addContactValidationScheme = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have min {#limit} characters',
    'string.max': 'name should have max {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberPattern).required().messages({
    'any.required': 'Phone number is required',
    'string.pattern.base': 'Please amende your phone number',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});

export const patchContactValidationScheme = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have min {#limit} characters',
    'string.max': 'name should have max {#limit} characters',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberPattern).messages({
    'string.pattern.base': 'Please amende your phone number',
  }),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});
