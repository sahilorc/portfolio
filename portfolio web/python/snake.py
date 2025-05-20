import random
import time
import js

# Snake game in Python for Pyodide
class SnakeGame:
    def __init__(self, width, height, cell_size):
        self.width = width
        self.height = height
        self.cell_size = cell_size
        self.grid_size = width // cell_size
        
        # Initialize snake
        self.snake = [(10, 10), (9, 10), (8, 10)]
        self.direction = "right"
        self.food = self.generate_food()
        self.score = 0
        self.game_over = False
        
    def generate_food(self):
        while True:
            x = random.randint(0, self.grid_size - 1)
            y = random.randint(0, self.grid_size - 1)
            
            # Make sure food doesn't spawn on snake
            if (x, y) not in self.snake:
                return (x, y)
    
    def change_direction(self, new_direction):
        # Prevent 180-degree turns
        if (new_direction == "up" and self.direction != "down" or
            new_direction == "down" and self.direction != "up" or
            new_direction == "left" and self.direction != "right" or
            new_direction == "right" and self.direction != "left"):
            self.direction = new_direction
    
    def move(self):
        if self.game_over:
            return
        
        # Get current head position
        head_x, head_y = self.snake[0]
        
        # Calculate new head position
        if self.direction == "up":
            head_y -= 1
        elif self.direction == "down":
            head_y += 1
        elif self.direction == "left":
            head_x -= 1
        elif self.direction == "right":
            head_x += 1
        
        # Check for wall collision
        if (head_x < 0 or head_x >= self.grid_size or 
            head_y < 0 or head_y >= self.grid_size):
            self.game_over = True
            return
        
        # Check for self collision
        if (head_x, head_y) in self.snake:
            self.game_over = True
            return
        
        # Add new head
        self.snake.insert(0, (head_x, head_y))
        
        # Check if food eaten
        if (head_x, head_y) == self.food:
            self.score += 10
            self.food = self.generate_food()
        else:
            # Remove tail if no food eaten
            self.snake.pop()
    
    def draw(self, ctx):
        # Clear canvas
        ctx.fillStyle = "#1f2937"
        ctx.fillRect(0, 0, self.width, self.height)
        
        # Draw snake
        for i, (x, y) in enumerate(self.snake):
            ctx.fillStyle = "#3b82f6" if i == 0 else "#60a5fa"
            ctx.fillRect(x * self.cell_size, y * self.cell_size, self.cell_size, self.cell_size)
            
            # Draw border
            ctx.strokeStyle = "#1f2937"
            ctx.strokeRect(x * self.cell_size, y * self.cell_size, self.cell_size, self.cell_size)
        
        # Draw food
        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.arc(
            (self.food[0] * self.cell_size) + (self.cell_size / 2),
            (self.food[1] * self.cell_size) + (self.cell_size / 2),
            self.cell_size / 2,
            0,
            2 * 3.14159
        )
        ctx.fill()
        
        # Draw score
        ctx.fillStyle = "#ffffff"
        ctx.font = "20px Arial"
        ctx.textAlign = "left"
        ctx.fillText(f"Score: {self.score}", 10, 30)
        
        # Draw game over message
        if self.game_over:
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
            ctx.fillRect(0, 0, self.width, self.height)
            
            ctx.fillStyle = "#ffffff"
            ctx.font = "30px Arial"
            ctx.textAlign = "center"
            ctx.fillText("Game Over", self.width / 2, self.height / 2 - 30)
            ctx.fillText(f"Score: {self.score}", self.width / 2, self.height / 2 + 10)
            ctx.font = "20px Arial"
            ctx.fillText("Press Start to play again", self.width / 2, self.height / 2 + 50)
    
    def reset(self):
        self.snake = [(10, 10), (9, 10), (8, 10)]
        self.direction = "right"
        self.food = self.generate_food()
        self.score = 0
        self.game_over = False

# Function to be called from JavaScript
def init_snake_game(canvas_id):
    canvas = js.document.getElementById(canvas_id)
    ctx = canvas.getContext("2d")
    
    game = SnakeGame(canvas.width, canvas.height, 20)
    
    def game_loop():
        if not game.game_over:
            game.move()
        game.draw(ctx)
    
    def handle_keydown(event):
        key = event.key
        if key == "ArrowUp":
            game.change_direction("up")
        elif key == "ArrowDown":
            game.change_direction("down")
        elif key == "ArrowLeft":
            game.change_direction("left")
        elif key == "ArrowRight":
            game.change_direction("right")
    
    # Set up event listeners
    js.document.addEventListener("keydown", handle_keydown)
    
    # Return game object and loop function for JavaScript to use
    return game, game_loop
