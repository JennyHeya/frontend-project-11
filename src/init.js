// src/init.js
import './style.css'
import i18n from './i18n.js'
import state from './state.js'
import view from './view.js'
import { getSchema } from './validators.js'

const elements = {
  form: document.querySelector('#rss-form'),
  input: document.querySelector('input[name="url"]'),
  submitButton: document.querySelector('button[type="submit"]'),
  feedback: document.getElementById('feedback')
}

const watchedState = view(state, elements, i18n)

elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = elements.input.value.trim()

  watchedState.form.state = 'processing'
  watchedState.form.error = null

  const schema = getSchema(watchedState.urls)

  schema
    .validate({ url }, { abortEarly: false })   // ← ОБЯЗАТЕЛЬНО ОБЪЕКТ { url }!
    .then(() => {
      watchedState.urls.push(url)
      watchedState.form.state = 'success'
    })
    .catch((err) => {
      watchedState.form.error = err.errors[0]   // ← 'required', 'url' или 'duplicate'
      watchedState.form.state = 'error'
    })
})
