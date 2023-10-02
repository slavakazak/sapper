import { MINE, CLOSED, OPEN, FLAG } from './constants.js'

export default class Touches {
  #t = [] //касания
  #isTouch = false //присутствует только одно касание без движения
  #timer //таймер долгого касания
  #isTime = false //прошло ли время долгого касания
  #move = 0 //суммарное перемещение
  #layer
  #flagMode
  constructor(layer, flagMode) {
    this.#layer = layer
    this.#flagMode = flagMode

    this.addTouch = this.addTouch.bind(this)
    this.removeTouch = this.removeTouch.bind(this)
    this.changeTouch = this.changeTouch.bind(this)
    this.scaling = this.scaling.bind(this)
    this.scope = this.scope.bind(this)
    this.copyTouch = this.copyTouch.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleСancel = this.handleСancel.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleWheel = this.handleWheel.bind(this)
  }
  //добавление точки касания
  addTouch(touch) {
    this.#isTouch = false
    if (this.#timer) clearTimeout(this.#timer)
    this.#timer = null
    this.#isTime = false
    this.#move = 0
    this.#t.push(touch)
    if (this.#t.length == 1) {
      this.#isTouch = true
      this.#timer = setTimeout(() => {
        navigator.vibrate(250)
        this.#isTime = true
      }, this.#layer.options.longTouchTime)
    }
  }
  //удаление точки касания
  removeTouch(touch, button = 0) {
    if (this.#timer) clearTimeout(this.#timer)
    this.#timer = null
    this.#move = 0

    if (this.#t.length > 1) {
      this.#isTouch = false
      this.#isTime = false
    }

    if (this.#t.length == 1) {
      const x = Math.floor((this.#t[0].x * this.#layer.graph.DPI - this.#layer.shift.x) / this.#layer.cellSize)
      const y = Math.floor((this.#t[0].y * this.#layer.graph.DPI - this.#layer.shift.y) / this.#layer.cellSize)
      if (x >= 0 && x < this.#layer.field.array.length && y >= 0 && y < this.#layer.field.array[0].length && this.#layer.field.array[x][y].state != OPEN && this.#isTouch) {
        if (this.#isTime || button != 0 || this.#flagMode.value) { //добавление, убирание флага
          if (this.#layer.field.array[x][y].state == FLAG) {
            this.#layer.field.array[x][y].state = CLOSED
          } else {
            this.#layer.field.array[x][y].state = FLAG
          }
        } else { //открытие клетки
          if (this.#layer.field.array[x][y].state == FLAG) {
            this.#layer.field.array[x][y].state = CLOSED
          } else {
            if (this.#layer.field.open(x, y) !== MINE) this.#layer.field.check()
          }
        }
        this.#layer.display()
      }
    }
    this.#t = this.#t.filter(item => item.id !== touch.id)
  }
  //изменение точки касания
  changeTouch(touch) {
    let t0 = {}, t1 = {} //первое и второе касания
    if (this.#t.length == 2) {
      t0 = { ...this.#t[0] }
      t1 = { ...this.#t[1] }
    }

    let previousTouch = this.#t.find(item => item.id == touch.id)

    if (previousTouch) {
      this.#move += Math.sqrt((touch.x - previousTouch.x) ** 2 + (touch.y - previousTouch.y) ** 2)
      if (this.#move > this.#layer.options.domesticShift) {
        this.#isTouch = false
        this.#isTime = false
      }
      this.#layer.shift.x += (touch.x - previousTouch.x) * this.#layer.graph.DPI
      this.#layer.shift.y += (touch.y - previousTouch.y) * this.#layer.graph.DPI
      previousTouch.x = touch.x
      previousTouch.y = touch.y
    }

    //масштабирование
    if (this.#t.length == 2) {
      const scale = Math.sqrt(((this.#t[0].x - this.#t[1].x) ** 2 + (this.#t[0].y - this.#t[1].y) ** 2) / ((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2))
      //центр приближения
      const tc = {
        x: (this.#t[0].x + this.#t[1].x) * this.#layer.graph.DPI / 2,
        y: (this.#t[0].y + this.#t[1].y) * this.#layer.graph.DPI / 2
      }
      this.scaling(scale, tc.x, tc.y)
    }

    //границы 
    this.scope('x', 'width')
    this.scope('y', 'height')

    this.#layer.display()
  }
  //масштабирование
  scaling(scale, x, y) {
    const cMin = Math.min((this.#layer.height - this.#layer.options.indent * 2) / this.#layer.options.height, (this.#layer.width - this.#layer.options.indent * 2) / this.#layer.options.width, this.#layer.cellSize) //минимальный размер клетки
    const cMax = Math.min(this.#layer.height, this.#layer.width) / 2 //максимальный размер клетки
    const prevC = this.#layer.cellSize
    const newC = this.#layer.cellSize * scale
    if (newC > cMax) {
      this.#layer.cellSize = cMax
    } else if (newC < cMin) {
      this.#layer.cellSize = cMin
    } else {
      this.#layer.cellSize = newC
    }
    scale = this.#layer.cellSize / prevC
    this.#layer.shift.x = scale * this.#layer.shift.x - x * (scale - 1)
    this.#layer.shift.y = scale * this.#layer.shift.y - y * (scale - 1)
  }
  //проверка выхода за границы
  scope(a, s) { //ось и сторона
    const fieldSize = this.#layer.cellSize * this.#layer.options[s] //размер поля
    const over = fieldSize + this.#layer.options.indent * 2 > this.#layer[s] //поле с границами больше видимой области
    const leftOverflow = this.#layer.shift[a] > this.#layer.options.indent //смещение слева больше максимального
    const rightOverflow = this.#layer.shift[a] + fieldSize < this.#layer[s] - this.#layer.options.indent //смещение справа больше максимального
    if (over && leftOverflow || !over && !leftOverflow) this.#layer.shift[a] = this.#layer.options.indent
    if (over && rightOverflow || !over && !rightOverflow) this.#layer.shift[a] = this.#layer[s] - this.#layer.options.indent - fieldSize
  }
  //копировать касание
  copyTouch({ identifier, pageX, pageY }) {
    return { id: identifier, x: pageX, y: pageY }
  }
  //касание экрана пальцем
  handleTouchStart(e) {
    e.preventDefault()
    const touches = e.changedTouches
    for (let i = 0; i < touches.length; i++) {
      this.addTouch(this.copyTouch(touches[i]))
    }
  }
  //нажатие левой кнопки мыши
  handleMouseDown(e) {
    e.preventDefault()
    this.addTouch({ id: 0, x: e.clientX, y: e.clientY })
  }
  //выход за пределы экрана
  handleСancel(e) {
    e.preventDefault()
    this.#isTouch = false
    if (this.#timer) clearTimeout(this.#timer)
    this.#timer = null
    this.#isTime = false
    this.#move = 0
    this.#t = []
  }
  //убирание пальца с экрана
  handleTouchEnd(e) {
    e.preventDefault()
    const touches = e.changedTouches
    for (let i = 0; i < touches.length; i++) {
      this.removeTouch(this.copyTouch(touches[i]))
    }
  }
  //отпускание мыши
  handleMouseUp(e) {
    e.preventDefault()
    this.removeTouch({ id: 0, x: e.clientX, y: e.clientY }, e.button)
  }
  //вызов контекстного меню
  handleContextMenu(e) {
    e.preventDefault()
  }
  //движение пальца по экрану
  handleTouchMove(e) {
    e.preventDefault()
    const touches = e.changedTouches
    for (let i = 0; i < touches.length; i++) {
      this.changeTouch(this.copyTouch(touches[i]))
    }
  }
  //движение мыши
  handleMouseMove(e) {
    e.preventDefault()
    this.changeTouch({ id: 0, x: e.clientX, y: e.clientY })
  }
  //прокрутка колёсика мыши
  handleWheel(e) {
    e.preventDefault()
    const scale = e.wheelDelta > 0 ? 1 + this.#layer.options.wheelSensitivity : 1 / (1 + this.#layer.options.wheelSensitivity)
    this.scaling(scale, e.clientX * this.#layer.graph.DPI, e.clientY * this.#layer.graph.DPI)
    //границы 
    this.scope('x', 'width')
    this.scope('y', 'height')
    this.#layer.display()
  }
}