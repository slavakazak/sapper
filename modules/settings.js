export default class Settings {
  #openTimer = null
  #closeTimer = null
  #duration
  #settingsEl
  #cardEl
  #crossBtn
  constructor(settingsEl, duration, inputs, buttonGroups) {
    this.#duration = duration
    this.#settingsEl = settingsEl
    this.#cardEl = settingsEl.querySelector('.pop-up-card')
    this.#crossBtn = settingsEl.querySelector('.cross')

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    this.#crossBtn.addEventListener('click', this.close)
    this.#settingsEl.addEventListener('click', this.close)
    this.#cardEl.addEventListener('click', e => e.stopPropagation())

    Object.keys(inputs).forEach(input => {
      const inputEl = settingsEl.querySelector(`.${input}-input`)
      inputEl.addEventListener('change', ({ target }) => {
        const value = target.value = Settings.validateInput(target)
        inputs[input](value)
      })
    })
    Object.keys(buttonGroups).forEach(buttonGroup => {
      const buttonGroupEl = settingsEl.querySelector(`.${buttonGroup}`)
      buttonGroupEl.addEventListener('click', ({ target }) => {
        const value = target.dataset.value
        if (value) {
          const buttons = buttonGroupEl.querySelectorAll('.button')
          buttons.forEach(el => el.classList.remove('active'))
          target.classList.add('active')
          buttonGroups[buttonGroup](value)
        }
      })
    })
  }
  open() {
    if (this.#closeTimer) clearTimeout(this.#closeTimer)
    this.#settingsEl.classList.add('before-active')
    this.#openTimer = setTimeout(() => this.#settingsEl.classList.add('active'), 0)
  }
  close() {
    if (this.#openTimer) clearTimeout(this.#openTimer)
    this.#settingsEl.classList.remove('active')
    this.#closeTimer = setTimeout(() => this.#settingsEl.classList.remove('before-active'), this.#duration)
  }
  static validateInput(el) {
    const defaultValue = el.dataset.default
    const min = el.getAttribute('min')
    const max = el.getAttribute('max')
    const step = el.getAttribute('step')
    const value = el.value
    if (!Number(value) && value !== '0') return defaultValue
    if (+value < min) return min
    if (+value > max) return max
    const whole = +value * (1 / +step)
    if (!Number.isInteger(whole)) return Math.round(whole) * +step
    return value
  }
}