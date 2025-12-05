// src/init.js
import './style.css'
import axios from 'axios'
import i18n from './i18n.js'
import state from './state.js'
import view from './view.js'
import { getSchema } from './validators.js'

const PROXY = 'https://allorigins.hexlet.app/get?disableCache=true&url='
const TIMEOUT = 10000

const elements = {
  form: document.getElementById('rss-form'),
  input: document.querySelector('#rss-form input[name="url"]'),
  submitButton: document.querySelector('#rss-form button[type="submit"]'),
  feedback: document.getElementById('feedback'),
  feedsContainer: document.getElementById('feeds'),
  postsContainer: document.getElementById('posts')
}

const watchedState = view(state, elements, i18n)

const parseRss = (content) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'application/xml')

  if (doc.querySelector('parsererror')) {
    throw new Error('invalidRss')
  }

  const title = doc.querySelector('channel > title')?.textContent ?? 'Без названия'
  const description = doc.querySelector('channel > description')?.textContent ?? ''

  const items = doc.querySelectorAll('item')
  const posts = Array.from(items).map((item) => ({
    id: crypto.randomUUID(),
    title: item.querySelector('title')?.textContent ?? 'Без названия',
    link: item.querySelector('link')?.textContent ?? '#',
    description: item.querySelector('description')?.textContent ?? ''
  }))

  return { title, description, posts }
}

const addFeed = (url) => {
  const proxyUrl = PROXY + encodeURIComponent(url)

  return axios.get(proxyUrl, { timeout: TIMEOUT })
    .then((response) => {
      const content = response.data.contents
      if (!content) throw new Error('network')
      return parseRss(content)
    })
    .then(({ title, description, posts }) => {
      const feedId = crypto.randomUUID()

      // присваивание
      watchedState.feeds = [{ id: feedId, title, description, url }, ...watchedState.feeds]
      
      const newPosts = posts.map(post => ({ ...post, feedId }))
      watchedState.posts = [...newPosts, ...watchedState.posts]

      watchedState.urls = [...watchedState.urls, url]

      watchedState.form.state = 'success'
    })
}

elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = elements.input.value

  watchedState.form.state = 'processing'
  watchedState.form.error = null

  const schema = getSchema(watchedState.urls)

  schema
.validate({ url }, { abortEarly: false })
  .then(() => addFeed(url))
.catch((err) => {
  let errorKey = 'network'

  if (err.name === 'ValidationError' && err.inner?.length > 0) {
    const firstError = err.inner[0]
    if (firstError.type === 'required') errorKey = 'required'
    else if (firstError.type === 'url') errorKey = 'url'
    else if (firstError.type === 'notOneOf') errorKey = 'duplicate'
  } else if (err.message === 'invalidRss') {
    errorKey = 'invalidRss'
  }

  watchedState.form.error = errorKey
  watchedState.form.state = 'error'
})
})

// === АВТООБНОВЛЕНИЕ 
const updateFeeds = async () => {
  if (watchedState.urls.length === 0) {
    setTimeout(updateFeeds, 5000)
    return
  }

  const updatePromises = watchedState.urls.map(async (url) => {
    try {
      const response = await axios.get(PROXY + encodeURIComponent(url), { timeout: TIMEOUT })
      const { posts: freshPosts } = parseRss(response.data.contents)

      const existingLinks = new Set(watchedState.posts.map(p => p.link))
      const newPosts = freshPosts
        .filter(post => !existingLinks.has(post.link))
        .map(post => ({
          ...post,
          id: crypto.randomUUID(),
          feedId: watchedState.feeds.find(f => f.url === url).id
        }))

      if (newPosts.length > 0) {
        watchedState.posts = [...newPosts, ...watchedState.posts]
      }
    } catch (err) {
      console.warn('Auto-update failed:', url, err.message)
    }
  })

  await Promise.allSettled(updatePromises)
  setTimeout(updateFeeds, 5000)
}

updateFeeds()

const modal = document.getElementById('modal')
const modalTitle = document.getElementById('modalTitle')
const modalDescription = document.getElementById('modalDescription')
const modalLink = document.getElementById('modalLink')

// Обработка клика по кнопке "Просмотр"
elements.postsContainer.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return

  const button = e.target
  const postId = button.dataset.id
  const post = watchedState.posts.find(p => p.id === postId)

  if (post) {
    // Помечаем как прочитанный
    watchedState.ui.viewedPostIds.add(postId)

    modalTitle.textContent = post.title
    modalDescription.textContent = post.description || 'Нет описания'
    modalLink.href = post.link

  }
})
