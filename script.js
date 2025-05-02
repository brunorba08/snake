const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const box = 20

let snake = [{ x: 9 * box, y: 10 * box }]
let direction = ''
let score = 0
let game
let isHardMode = false
let snakeColor = '#00ff00'

let food = spawnFood()

const eatSound = new Audio('comer.mp3')
const dieSound = new Audio('morrer.mp3')

document.addEventListener('keydown', dir)

function dir(event) {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT'
  else if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP'
  else if (event.key === 'ArrowRight' && direction !== 'LEFT')
    direction = 'RIGHT'
  else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN'
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Cobra
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = snakeColor
    ctx.beginPath()
    ctx.roundRect(snake[i].x, snake[i].y, box, box, 6)
    ctx.fill()
  }

  // Comida
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, 2 * Math.PI)
  ctx.fill()

  let snakeX = snake[0].x
  let snakeY = snake[0].y

  if (direction === 'LEFT') snakeX -= box
  if (direction === 'RIGHT') snakeX += box
  if (direction === 'UP') snakeY -= box
  if (direction === 'DOWN') snakeY += box

  // Modo difícil
  if (isHardMode) {
    if (snakeX < 0) snakeX = canvas.width - box
    else if (snakeX >= canvas.width) snakeX = 0
    if (snakeY < 0) snakeY = canvas.height - box
    else if (snakeY >= canvas.height) snakeY = 0
  }

  // Comer
  if (snakeX === food.x && snakeY === food.y) {
    score++
    food = spawnFood()
    eatSound.play()
  } else {
    snake.pop()
  }

  const newHead = { x: snakeX, y: snakeY }

  // Colisão
  if (
    (!isHardMode &&
      (snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height)) ||
    collision(newHead, snake)
  ) {
    clearInterval(game)
    dieSound.play()
    setTimeout(() => alert('Fim de jogo! Pontuação: ' + score), 100)
    return
  }

  snake.unshift(newHead)

  // Pontuação
  ctx.fillStyle = 'white'
  ctx.font = '20px Arial'
  ctx.fillText('Pontuação: ' + score, 10, 390)
}

function collision(head, array) {
  return array.some((segment) => head.x === segment.x && head.y === segment.y)
}

// Botão Iniciar
document.getElementById('startBtn').addEventListener('click', () => {
  snakeColor = document.getElementById('snakeColor').value
  document.getElementById('startScreen').style.display = 'none'
  document.getElementById('game').style.display = 'block'
  document.getElementById('controls').style.display = 'block'
  resetGame()
  game = setInterval(draw, isHardMode ? 70 : 100)
})

// Botão Reiniciar
document.getElementById('restartBtn').addEventListener('click', () => {
  clearInterval(game)
  resetGame()
  game = setInterval(draw, isHardMode ? 70 : 100)
})

// Botão Modo Difícil
document.getElementById('toggleModeBtn').addEventListener('click', () => {
  isHardMode = !isHardMode
  document.getElementById('toggleModeBtn').textContent = `Modo: ${
    isHardMode ? 'Difícil' : 'Normal'
  }`
})

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }]
  direction = ''
  score = 0
  food = spawnFood()
}

// Função para bordas arredondadas
CanvasRenderingContext2D.prototype.roundRect = function (
  x,
  y,
  width,
  height,
  radius
) {
  this.beginPath()
  this.moveTo(x + radius, y)
  this.lineTo(x + width - radius, y)
  this.quadraticCurveTo(x + width, y, x + width, y + radius)
  this.lineTo(x + width, y + height - radius)
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  this.lineTo(x + radius, y + height)
  this.quadraticCurveTo(x, y + height, x, y + height - radius)
  this.lineTo(x, y + radius)
  this.quadraticCurveTo(x, y, x + radius, y)
  this.closePath()
}
