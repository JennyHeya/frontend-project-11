// src/i18n.js
import i18next from 'i18next'

const i18n = i18next.createInstance()

await i18n.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        errors: {
          required: 'Не должно быть пустым',
          url: 'Введите корректный URL',
          duplicate: 'RSS уже существует',
          network: 'Ошибка сети',
          invalidRss: 'Ресурс не содержит валидный RSS'
        },
        success: 'RSS успешно загружен',
        loading: 'Загрузка...'
      }
    }
  }
})

export default i18n
