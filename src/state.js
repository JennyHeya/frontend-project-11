// src/state.js
export default {
  form: {
    state: 'initial',
    error: null
  },
  urls: [],
  feeds: [],
  posts: [],
  ui: {
    viewedPostIds: new Set()  // id прочитанных постов
  },
  modal: {
    postId: null  // id поста
  }
}
