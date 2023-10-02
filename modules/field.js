import { MINE, CLOSED, OPEN } from './constants.js'
import Alert from "./alert.js"

export default class Field {
  array = []
  #first = true
  #alert
  #options
  constructor(layer) {
    this.#alert = new Alert(document.querySelector('#alert'), layer.graph.duration, () => {
      this.clear()
      layer.display()
    })

    this.#options = layer.options

    this.num = this.num.bind(this)
    this.inBord = this.inBord.bind(this)
    this.open = this.open.bind(this)
    this.check = this.check.bind(this)
    this.clear = this.clear.bind(this)
    this.generateMines = this.generateMines.bind(this)
  }
  num(x, y) {
    let num = 0
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.inBord(i, j) && this.array[i][j].value === MINE) num++
      }
    }
    return num
  }
  inBord(i, j) {
    return i >= 0 && i < this.array.length && j >= 0 && j < this.array[0].length
  }
  open(x, y) {
    let value
    if (this.#first) {
      this.generateMines(x, y)
      this.#first = false
    }
    this.array[x][y].state = OPEN
    if (this.array[x][y].value == MINE) {
      this.#alert.open('Mine!')
      value = MINE
    } else {
      value = this.array[x][y].value = this.num(x, y)
    }

    if (this.array[x][y].value == 0) {
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (this.inBord(i, j) && this.array[i][j].state != OPEN) this.open(i, j)
        }
      }
    }
    return value
  }
  check() {
    let ok = true
    for (let i = 0; i < this.array.length; i++) {
      for (let j = 0; j < this.array[0].length; j++) {
        if (this.array[i][j].value != MINE && this.array[i][j].state != OPEN) {
          ok = false
        }
      }
    }
    if (ok) this.#alert.open('Victory!')
  }
  clear() {
    this.#first = true
    this.array = []
    for (let i = 0; i < this.#options.width; i++) {
      this.array[i] = []
      for (let j = 0; j < this.#options.height; j++) {
        this.array[i][j] = { value: 0, state: CLOSED }
      }
    }
  }
  generateMines(x, y) {
    for (let i = 0; i < this.#options.width; i++) {
      for (let j = 0; j < this.#options.height; j++) {
        if (!(i >= x - 1 && i <= x + 1 && j >= y - 1 && j <= y + 1) && Math.random() < this.#options.mineChance) {
          this.array[i][j].value = MINE
        }
      }
    }
  }
}