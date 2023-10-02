export default class Menu {
  constructor(menuEl, buttons) {
    Object.keys(buttons).forEach(button => {
      const buttonEl = menuEl.querySelector(`.${button}`)
      buttonEl.addEventListener('click', () => {
        buttons[button]()
      })
    })
  }
}