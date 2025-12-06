import onChange from 'on-change'

export const renderForm = (elements, i18n, formState, error = null) => {
  elements.input.classList.remove('is-invalid')
  elements.feedback.classList.remove('text-danger', 'text-success')
  elements.feedback.textContent = ''

  switch (formState) {
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
      break

    case 'error':
      elements.input.classList.add('is-invalid')
      elements.feedback.classList.remove('text-success')
      elements.feedback.classList.add('text-danger')
      elements.feedback.textContent = i18n.t(`errors.${error}`)
      elements.input.removeAttribute('readonly')
      elements.submitButton.disabled = false
      break

    default:
      elements.input.removeAttribute('readonly')
      elements.submitButton.disabled = false
      break
  }
}

const renderFeeds = (elements, feeds) => {
  elements.feedsContainer.innerHTML = ''

  if (feeds.length === 0) return

  const card = document.createElement('div')
  card.className = 'card border-0'
  card.innerHTML = `
    <div class="card-body">
      <h2 class="card-title h4">Фиды</h2>
    </div>
    <ul class="list-group border-0 rounded-0">
      ${feeds.map((feed) => `
        <li class="list-group-item border-0 border-end-0">
          <h3 class="h6 m-0">${feed.title}</h3>
          <p class="m-0 small text-black-50">${feed.description}</p>
        </li>
      `).join('')}
    </ul>
  `
  elements.feedsContainer.append(card)
}

const renderPosts = (elements, posts, { viewedPostIds }) => {
  elements.postsContainer.innerHTML = ''

  if (posts.length === 0) return

  const card = document.createElement('div')
  card.className = 'card border-0'

  card.innerHTML = `
    <div class="card-body">
      <h2 class="card-title h4">Посты</h2>
    </div>
    <ul class="list-group border-0 rounded-0">
      ${posts.map((post) => {
        const isViewed = viewedPostIds.has(post.id)
        const linkWeight = isViewed ? 'fw-normal link-secondary' : 'fw-bold'

        return `
          <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
            <a 
              href="${post.link}" 
              class="${linkWeight}" 
              target="_blank" 
              rel="noopener noreferrer"
              data-post-id="${post.id}"
            >
              ${post.title}
            </a>
            <button 
              type="button" 
              class="btn btn-outline-primary btn-sm" 
              data-id="${post.id}" 
              data-bs-toggle="modal" 
              data-bs-target="#modal"
            >
              Просмотр
            </button>
          </li>
        `
      }).join('')}
    </ul>
  `

  elements.postsContainer.append(card)
}

const createWatchedState = (state, elements, i18n) => {
  const render = () => {
    const { form, feeds, posts } = state
    renderForm(elements, i18n, form.state, form.error)
    renderFeeds(elements, feeds)
    renderPosts(elements, posts, state.ui)
  }

  const handleStateChange = () => {
    render()
  }

  const watched = onChange(state, handleStateChange)
  render()
  return watched
}

export default createWatchedState
