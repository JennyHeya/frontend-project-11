// src/validators.js
import * as yup from 'yup'

export const getSchema = (existingUrls) =>
  yup.object().shape({
    url: yup
      .string()
      .required('required')
      .trim()
      .url('url')
      .notOneOf(existingUrls, 'duplicate')
  })
  