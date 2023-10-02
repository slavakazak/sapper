import { MINE, OPEN, FLAG, options, graph, theme, cellSize } from './constants.js'
import Field from './field.js'
import Touches from './touches.js'
import FlagMode from './flag-mode.js'

export default class Layer {
  constructor(container) {
    this.options = options
    this.graph = graph
    this.theme = theme

    const mineImg = new Image()
    mineImg.onload = () => this.mineImg = mineImg
    mineImg.src = "../img/mine.png"

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    container.appendChild(this.canvas)
    this.fitToContainer = this.fitToContainer.bind(this)
    this.fitToContainer()

    this.cellSize = cellSize
    this.shift = {
      x: (this.width - this.options.width * this.cellSize) / 2,
      y: (this.height - this.options.height * this.cellSize) / 2
    } //сдвиг

    this.display = this.display.bind(this)

    this.field = new Field(this)

    const modeBtn = document.querySelector('.mode')
    const flagMode = new FlagMode(modeBtn)
    this.touches = new Touches(this, flagMode)

    this.canvas.addEventListener("touchstart", this.touches.handleTouchStart, false)
    this.canvas.addEventListener("mousedown", this.touches.handleMouseDown, false)
    this.canvas.addEventListener("touchcancel", this.touches.handleСancel, false)
    this.canvas.addEventListener("mouseout", this.touches.handleСancel, false)
    this.canvas.addEventListener("touchend", this.touches.handleTouchEnd, false)
    this.canvas.addEventListener("mouseup", this.touches.handleMouseUp, false)
    this.canvas.addEventListener("contextmenu", this.touches.handleContextMenu, false)
    this.canvas.addEventListener("touchmove", this.touches.handleTouchMove, false)
    this.canvas.addEventListener("mousemove", this.touches.handleMouseMove, false)
    this.canvas.addEventListener('wheel', this.touches.handleWheel, false)
  }
  fitToContainer() {
    this.width = this.canvas.width = this.canvas.offsetWidth * this.graph.DPI
    this.height = this.canvas.height = this.canvas.offsetHeight * this.graph.DPI
  }
  display() {
    const options = this.options
    const graph = this.graph
    const theme = this.theme
    const shift = this.shift
    const cellSize = this.cellSize
    const context = this.context
    const field = this.field
    //номер первой клетки в области видимости
    let fi = shift.x < 0 ? Math.floor(-shift.x / cellSize) : 0
    let fj = shift.y < 0 ? Math.floor(-shift.y / cellSize) : 0
    //номер последней клетки в области видимости
    let li = Math.min(Math.ceil((-shift.x + this.width) / cellSize), options.width)
    let lj = Math.min(Math.ceil((-shift.y + this.height) / cellSize), options.height)

    //очистка холста
    context.fillStyle = theme.bgColor
    context.fillRect(0, 0, this.width, this.height)

    //поле
    context.fillStyle = theme.fillColor
    context.fillRect(fi * cellSize + shift.x, fj * cellSize + shift.y, (li - fi) * cellSize, (lj - fj) * cellSize)

    if (cellSize > graph.cell) {
      context.font = `${cellSize}px sans-serif`
      for (let i = fi; i < li; i++) {
        for (let j = fj; j < lj; j++) {
          //положение и размер текущей клетки
          const b = {
            x: i * cellSize + shift.x - 1,
            y: j * cellSize + shift.y - 1,
            cellSize: cellSize + 2
          }
          if (field.array[i][j].state === FLAG) {
            context.fillStyle = theme.flagColor
            context.fillRect(b.x, b.y, b.cellSize, b.cellSize)
          } else if (field.array[i][j].state === OPEN) {
            context.fillStyle = theme.bgColor
            context.fillRect(b.x, b.y, b.cellSize, b.cellSize)
            if (field.array[i][j].value === MINE) {
              context.fillStyle = theme.mineColor
              context.fillRect(b.x, b.y, b.cellSize, b.cellSize)
              context.drawImage(this.mineImg, b.x, b.y, b.cellSize, b.cellSize)
            } else if (field.array[i][j].value > 0 && cellSize > graph.text) {
              context.fillStyle = theme.fontColor[(+field.array[i][j].value - 1) % theme.numberOfColors]
              context.fillText(field.array[i][j].value, i * cellSize + 7 * cellSize / 32 + shift.x, j * cellSize + 28 * cellSize / 32 + shift.y)
            }
          }
        }
      }
    }

    //сетка
    context.lineWidth = graph.DPI
    context.strokeStyle = theme.gridColor
    if (cellSize > graph.grid) {
      context.beginPath()
      for (let i = fi; i <= li; i++) {
        context.moveTo(i * cellSize + shift.x, shift.y)
        context.lineTo(i * cellSize + shift.x, options.height * cellSize + shift.y)
      }
      for (let j = fj; j <= lj; j++) {
        context.moveTo(shift.x, j * cellSize + shift.y)
        context.lineTo(options.width * cellSize + shift.x, j * cellSize + shift.y)
      }
      context.stroke()
    }

    //стена
    context.lineWidth = graph.DPI * 2
    context.strokeStyle = theme.borderColor
    context.strokeRect(shift.x, shift.y, options.width * cellSize, options.height * cellSize)
  }
}