import * as yup from 'yup'

export const getSchema = existingUrls =>
  yup.object().shape({
    url: yup
      .string()
      .required('required')
      .test('is-url', 'url', (value) => {
        if (!value) return false
        try {
          new URL(value)
          return true
        }
        catch {
          return false
        }
      })
      .notOneOf(existingUrls, 'duplicate'),
  })
