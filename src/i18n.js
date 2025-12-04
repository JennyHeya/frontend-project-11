// src/i18n.js
import i18next from 'i18next'

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        feedsTitle: 'Фиды',
        postsTitle: 'Посты',
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

export { i18next as default }
