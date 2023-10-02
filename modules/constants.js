export const MINE = 'mine'
export const CLOSED = 'closed'
export const OPEN = 'open'
export const FLAG = 'flag'

export const textColors = { //цвет текста
  //red-A200 light_blue-A400 green-A700 yellow-A700 deep_orange-A200 purple-A100 cyan-A700 lime-A700
  rainbow: ['#ff5252', '#00b0ff', '#00c853', '#ffd600', '#ff6e40', '#ea80fc', '#00b8d4', '#aeea00'],
  //yellow-A700 amber-A700 orange-A700 deep_orange-A200 red-A100 pink-A100 purple-A100 deep_purple-A100
  red: ['#ffd600', '#ffab00', '#ff6d00', '#ff6e40', '#ff8a80', '#ff80ab', '#ea80fc', '#b388ff'],
  //cyan-A700 blue-A100 deep_purple-A100 pink-A100 teal-A700 light_blue-A400 indigo-A100 purple-A100
  blue: ['#00b8d4', '#82b1ff', '#b388ff', '#ff80ab', '#00bfa5', '#00b0ff', '#8c9eff', '#ea80fc'],
  //cyan-A700 blue-A100 deep_purple-A100 pink-A100 teal-A700 light_blue-A400 indigo-A100 purple-A100
  green: ['#aeea00', '#64dd17', '#00c853', '#00bfa5', '#00b8d4', '#00b0ff', '#82b1ff', '#ffd600']
}

export const themes = {
  light: {
    bgColor: '#212121', //цвет фона grey-900
    gridColor: '#757575', //цвет сетки grey-600
    fillColor: '#e0e0e0', //цвет закрытой клетки grey-300
    borderColor: '#fafafa', //цвет границы grey-500
    mineColor: '#e53935', //цвет мины red-600
    flagColor: '#ffb300', //цвет флага amber-600
  },
  dark: {
    bgColor: '#616161', //цвет фона grey-700
    gridColor: '#424242', //цвет сетки grey-800
    fillColor: '#212121', //цвет закрытой клетки grey-900
    borderColor: '#424242', //цвет границы grey-800
    mineColor: '#d50000', //цвет мины red-A700
    flagColor: '#ff6d00', //цвет флага orange-A700
  }
}

export const options = {
  width: 20, //колличество клеток в строке
  height: 20, //колличество клеток в столбце
  indent: 20, //отступ
  mineChance: 0.15, //вероятность мины
  longTouchTime: 500, //время долгого касания (ms)
  wheelSensitivity: 0.5, //чувствительность колёсика (> 0)
  domesticShift: 30 //максимальный допустимый сдвиг при нажатии
}

export const graph = {
  DPI: 2, //точек на дюйм
  text: 5, //прорисовка текста
  grid: 10, //прорисовка сетки
  cell: 2, //прорисовка ячеек
  duration: 200 //время анимации
}

export const theme = {
  ...themes.dark,
  fontColor: textColors.rainbow,
  numberOfColors: 8, //колличество цветов
}

export const cellSize = 50 //размер клетки