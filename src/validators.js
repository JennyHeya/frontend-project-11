// src/validators.js
import * as yup from 'yup'

export const getSchema = (existingUrls) =>
  yup.object({
    url: yup
      .string()
      .required('required')    // ← ПЕРЕД TRIM!
      .trim()
      .url('url')
      .notOneOf(existingUrls, 'duplicate')
  })
  
  