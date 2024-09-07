import { contactCollection } from '../db/models/Contact.js';

export const getAllStudents = () => contactCollection.find();

export const getStudentById = (id) => contactCollection.findById(id);
