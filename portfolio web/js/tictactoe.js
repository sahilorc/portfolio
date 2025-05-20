document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".tictactoe-cell")
  const statusDisplay = document.getElementById("tictactoe-status")
  const resetButton = document.getElementById("reset-tictactoe")

  let gameActive = true
  let currentPlayer = "X"
  let gameState = ["", "", "", "", "", "", "", "", ""]

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target
    const clickedCellIndex = Number.parseInt(Array.from(cells).indexOf(clickedCell))

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
      return
    }

    handleCellPlayed(clickedCell, clickedCellIndex)
    handleResultValidation()

    if (gameActive) {
      setTimeout(() => {
        makeAIMove()
      }, 500)
    }
  }

  function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer
    clickedCell.innerHTML =
      currentPlayer === "X" ? '<span class="text-blue-500">X</span>' : '<span class="text-red-500">O</span>'
  }

  function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X"
    statusDisplay.innerHTML = currentPlayer === "X" ? "Your turn (X)" : "Computer's turn (O)"
  }

  function handleResultValidation() {
    let roundWon = false
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i]
      const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]

      if (condition) {
        roundWon = true
        break
      }
    }

    if (roundWon) {
      statusDisplay.innerHTML = currentPlayer === "X" ? "You won!" : "Computer won!"
      gameActive = false
      return
    }

    const roundDraw = !gameState.includes("")
    if (roundDraw) {
      statusDisplay.innerHTML = "Game ended in a draw!"
      gameActive = false
      return
    }

    handlePlayerChange()
  }

  function makeAIMove() {
    if (!gameActive || currentPlayer === "X") return

    // Check if AI can win
    for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === "") {
        gameState[i] = "O"
        if (checkWinningMove()) {
          cells[i].innerHTML = '<span class="text-red-500">O</span>'
          handleResultValidation()
          return
        }
        gameState[i] = ""
      }
    }

    // Check if player can win and block
    for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === "") {
        gameState[i] = "X"
        if (checkWinningMove()) {
          gameState[i] = "O"
          cells[i].innerHTML = '<span class="text-red-500">O</span>'
          handleResultValidation()
          return
        }
        gameState[i] = ""
      }
    }

    // Try to take center if available
    if (gameState[4] === "") {
      gameState[4] = "O"
      cells[4].innerHTML = '<span class="text-red-500">O</span>'
      handleResultValidation()
      return
    }

    // Try to take corners
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter((i) => gameState[i] === "")

    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)]
      gameState[randomCorner] = "O"
      cells[randomCorner].innerHTML = '<span class="text-red-500">O</span>'
      handleResultValidation()
      return
    }

    // Take any available space
    const availableMoves = gameState.map((cell, index) => (cell === "" ? index : null)).filter((cell) => cell !== null)

    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
      gameState[randomMove] = "O"
      cells[randomMove].innerHTML = '<span class="text-red-500">O</span>'
      handleResultValidation()
    }
  }

  function checkWinningMove() {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i]
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        return true
      }
    }
    return false
  }

  function handleRestartGame() {
    gameActive = true
    currentPlayer = "X"
    gameState = ["", "", "", "", "", "", "", "", ""]
    statusDisplay.innerHTML = "Your turn (X)"
    cells.forEach((cell) => (cell.innerHTML = ""))
  }

  // Event listeners
  cells.forEach((cell) => cell.addEventListener("click", handleCellClick))
  resetButton.addEventListener("click", handleRestartGame)

  // Initialize game
  handleRestartGame()
})
