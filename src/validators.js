// src/validators.js
import * as yup from 'yup'

export const getSchema = (existingUrls) =>
  yup.object({
    url: yup
      .string()
      .trim()
      .required('required')
      .url('url')
      .notOneOf(existingUrls, 'duplicate')
  })
  