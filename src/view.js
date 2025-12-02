// src/view.js
import onChange from 'on-change'

export default (state, elements, i18n) => {
  const render = () => {
    const { form } = state

    // очищаем старые классы
    elements.input.classList.remove('is-invalid')
    elements.feedback.classList.remove('text-danger', 'text-success')
    elements.feedback.textContent = ''

    switch (form.state) {
      case 'processing':
        elements.input.setAttribute('readonly', true)
        elements.submitButton.disabled = true
        elements.feedback.textContent = i18n.t('loading')
        break

      case 'success':
        elements.feedback.classList.add('text-success')
        elements.feedback.textContent = i18n.t('success')
        elements.form.reset()
        elements.input.focus()
        elements.input.removeAttribute('readonly')
        elements.submitButton.disabled = false
        break;

      case 'error':
        elements.input.classList.add('is-invalid')
        elements.feedback.classList.add('text-danger')
        elements.feedback.textContent = i18n.t(`errors.${form.error}`)
        elements.input.removeAttribute('readonly')
        elements.submitButton.disabled = false
        break

      default:
        elements.input.removeAttribute('readonly')
        elements.submitButton.disabled = false
        break
    }
  }

  const watched = onChange(state, () => render())

  // первый рендер
  render()

  return watched
}
