export default class FlagMode {
  value = false
  constructor(modeBtn) {
    modeBtn.addEventListener('click', () => {
      if (modeBtn.classList.contains('active')) {
        modeBtn.classList.remove('active')
        modeBtn.innerHTML = 'Opening mode'
        this.value = false
      } else {
        modeBtn.classList.add('active')
        modeBtn.innerHTML = 'Flag mode'
        this.value = true
      }
    })
  }
}