document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("snake-canvas")
  const ctx = canvas.getContext("2d")
  const startButton = document.getElementById("start-snake")
  const resetButton = document.getElementById("reset-snake")

  const GRID_SIZE = 20
  const CELL_SIZE = canvas.width / GRID_SIZE

  let snake = []
  let food = {}
  let direction = "right"
  let gameRunning = false
  let gameLoop
  let score = 0

  function initGame() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]

    direction = "right"
    score = 0
    generateFood()
    drawGame()
  }

  function generateFood() {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }

    // Make sure food doesn't spawn on snake
    for (const cell of snake) {
      if (cell.x === food.x && cell.y === food.y) {
        return generateFood()
      }
    }
  }

  function drawGame() {
    // Clear canvas
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw snake
    snake.forEach((cell, index) => {
      ctx.fillStyle = index === 0 ? "#3b82f6" : "#60a5fa"
      ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

      // Draw border
      ctx.strokeStyle = "#1f2937"
      ctx.strokeRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    })

    // Draw food
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw score
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${score}`, 10, 30)
  }

  function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y }

    switch (direction) {
      case "up":
        head.y -= 1
        break
      case "down":
        head.y += 1
        break
      case "left":
        head.x -= 1
        break
      case "right":
        head.x += 1
        break
    }

    // Check for wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      gameOver()
      return
    }

    // Check for self collision
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver()
        return
      }
    }

    // Add new head
    snake.unshift(head)

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
      score += 10
      generateFood()
    } else {
      // Remove tail if no food eaten
      snake.pop()
    }

    drawGame()
  }

  function gameOver() {
    clearInterval(gameLoop)
    gameRunning = false

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 30)
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10)
    ctx.font = "20px Arial"
    ctx.fillText("Press Start to play again", canvas.width / 2, canvas.height / 2 + 50)
  }

  function startGame() {
    if (gameRunning) return

    initGame()
    gameRunning = true
    gameLoop = setInterval(moveSnake, 150)
  }

  function resetGameState() {
    clearInterval(gameLoop)
    gameRunning = false
    initGame()
  }

  // Event listeners
  startButton.addEventListener("click", startGame)
  resetButton.addEventListener("click", resetGameState)

  document.addEventListener("keydown", (e) => {
    if (!gameRunning) return

    switch (e.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up"
        break
      case "ArrowDown":
        if (direction !== "up") direction = "down"
        break
      case "ArrowLeft":
        if (direction !== "right") direction = "left"
        break
      case "ArrowRight":
        if (direction !== "left") direction = "right"
        break
    }
  })

  // Initialize game
  initGame()
})
