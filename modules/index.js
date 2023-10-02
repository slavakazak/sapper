import { themes, textColors } from './constants.js'
import Layer from './layer.js'
import Settings from "./settings.js"
import Menu from "./menu.js"

//Layer----------------------------------------------------------------------------------
const container = document.getElementById('canvas-wrap')
const layer = new Layer(container)

//settings-------------------------------------------------------------------------------------
const settingsEl = document.querySelector('#settings')
const inputs = {
  width(value) {
    layer.options.width = +value
    layer.field.clear()
    layer.shift.x = (layer.width - layer.options.width * layer.cellSize) / 2
    layer.display()
  },
  height(value) {
    layer.options.height = +value
    layer.field.clear()
    layer.shift.y = (layer.height - layer.options.height * layer.cellSize) / 2
    layer.display()
  },
  indent(value) {
    layer.options.indent = +value
    layer.display()
  },
  cell_size(value) {
    const cellSizePrev = layer.cellSize
    layer.cellSize = +value
    const scale = layer.cellSize / cellSizePrev
    layer.shift.x = scale * layer.shift.x - (layer.width / 2) * (scale - 1)
    layer.shift.y = scale * layer.shift.y - (layer.height / 2) * (scale - 1)
    layer.display()
  },
  mine(value) {
    layer.options.mineChance = +value / 100
    layer.field.clear()
    layer.display()
  },
  touch(value) {
    layer.options.longTouchTime = +value
  },
  wheel(value) {
    layer.options.wheelSensitivity = +value
  },
  shift(value) {
    layer.options.domesticShift = +value
  },
  dpi(value) {
    layer.graph.DPI = +value
    layer.fitToContainer()
    layer.display()
  },
  duration(value) {
    layer.graph.duration = +value
    document.body.style.setProperty('--duration', value + 'ms');
  },
  text_draw(value) {
    layer.graph.text = +value
    layer.display()
  },
  grid_draw(value) {
    layer.graph.grid = +value
    layer.display()
  },
  cell_draw(value) {
    layer.graph.cell = +value
    layer.display()
  }
}
const buttonGroups = {
  themes(value) {
    layer.theme = { ...layer.theme, ...themes[value] }
    layer.display()
  },
  text_color(value) {
    layer.theme = { ...layer.theme, fontColor: textColors[value] }
    layer.display()
  }
}
const settings = new Settings(settingsEl, layer.graph.duration, inputs, buttonGroups)

//menu------------------------------------------------------------------------------------------
const menuEl = document.querySelector('#menu')
const buttons = {
  replay() {
    layer.field.clear()
    layer.display()
  },
  settings() {
    settings.open()
  }
}
new Menu(menuEl, buttons)

//app--------------------------------------------------------------------------------------------
layer.field.clear()
layer.display()

addEventListener('resize', () => {
  layer.fitToContainer()
  layer.display()
})