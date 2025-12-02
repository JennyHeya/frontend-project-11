import "./style.css";

const html = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6">
        <h1 class="h3 mb-5 text-center fw-normal">RSS агрегатор</h1>

        <form id="rss-form" class="mb-5">
          <div class="input-group input-group-lg">
            <input
              type="url"
              class="form-control"
              placeholder="RSS-ссылка"
              aria-label="RSS URL"
              required
              autofocus
            />
            <button class="btn btn-primary px-5" type="submit">
              Добавить
            </button>
          </div>
          <div class="form-text mt-2 text-muted">
            Пример: https://ru.hexlet.io/lessons.rss
          </div>
        </form>

        <div id="feedback"></div>
        <div id="feeds"></div>
        <div id="posts"></div>
      </div>
    </div>
  </div>
`;

document.querySelector("#app").innerHTML = html;

// Временный обработчик — просто показывает, что форма работает
document.getElementById("rss-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const url = e.target.elements[0].value.trim();
  if (!url) return;

  document.getElementById("feedback").innerHTML = `
    <div class="alert alert-success mt-4" role="alert">
      Поток успешно добавлен: <strong>${url}</strong>
    </div>
  `;

  e.target.reset();
});