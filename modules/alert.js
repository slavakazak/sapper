export default class Alert {
  #openTimer = null
  #closeTimer = null
  #duration
  #alertEl
  #titleEl
  #cardEl
  #replayBtn
  #crossBtn
  constructor(alertEl, duration, replay) {
    this.#duration = duration
    this.#alertEl = alertEl
    this.#titleEl = alertEl.querySelector('.title')
    this.#cardEl = alertEl.querySelector('.pop-up-card')
    this.#replayBtn = alertEl.querySelector('.alert-replay')
    this.#crossBtn = alertEl.querySelector('.cross')

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    this.#replayBtn.addEventListener('click', () => {
      replay()
      this.close()
    })
    this.#crossBtn.addEventListener('click', this.close)
    this.#alertEl.addEventListener('click', this.close)
    this.#cardEl.addEventListener('click', e => e.stopPropagation())
  }
  open(text = 'Error!') {
    if (this.#closeTimer) clearTimeout(this.#closeTimer)
    this.#alertEl.classList.add('before-active')
    this.#openTimer = setTimeout(() => this.#alertEl.classList.add('active'), 0)
    this.#titleEl.innerHTML = text
  }
  close() {
    if (this.#openTimer) clearTimeout(this.#openTimer)
    this.#alertEl.classList.remove('active')
    this.#closeTimer = setTimeout(() => this.#alertEl.classList.remove('before-active'), this.#duration)
  }
}