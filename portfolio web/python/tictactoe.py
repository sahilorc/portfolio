import random
import js

# Tic Tac Toe game in Python for Pyodide
class TicTacToe:
    def __init__(self):
        self.board = [''] * 9
        self.current_player = 'X'
        self.game_active = True
        self.winning_conditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
            [0, 4, 8], [2, 4, 6]              # diagonals
        ]
    
    def make_move(self, position):
        if not self.game_active or self.board[position] != '':
            return False
        
        self.board[position] = self.current_player
        
        # Check for win or draw
        if self.check_win():
            return True
        
        if '' not in self.board:
            self.game_active = False
            return True
        
        # Switch player
        self.current_player = 'O' if self.current_player == 'X' else 'X'
        return True
    
    def check_win(self):
        for condition in self.winning_conditions:
            a, b, c = condition
            if (self.board[a] and 
                self.board[a] == self.board[b] and 
                self.board[a] == self.board[c]):
                self.game_active = False
                return True
        return False
    
    def ai_move(self):
        if not self.game_active or self.current_player != 'O':
            return -1
        
        # Check if AI can win
        for i in range(9):
            if self.board[i] == '':
                self.board[i] = 'O'
                if self.check_win_without_ending():
                    self.board[i] = ''
                    return i
                self.board[i] = ''
        
        # Check if player can win and block
        for i in range(9):
            if self.board[i] == '':
                self.board[i] = 'X'
                if self.check_win_without_ending():
                    self.board[i] = ''
                    return i
                self.board[i] = ''
        
        # Try to take center
        if self.board[4] == '':
            return 4
        
        # Try to take corners
        corners = [0, 2, 6, 8]
        available_corners = [i for i in corners if self.board[i] == '']
        if available_corners:
            return random.choice(available_corners)
        
        # Take any available space
        available_moves = [i for i, cell in enumerate(self.board) if cell == '']
        if available_moves:
            return random.choice(available_moves)
        
        return -1
    
    def check_win_without_ending(self):
        for condition in self.winning_conditions:
            a, b, c = condition
            if (self.board[a] and 
                self.board[a] == self.board[b] and 
                self.board[a] == self.board[c]):
                return True
        return False
    
    def reset(self):
        self.board = [''] * 9
        self.current_player = 'X'
        self.game_active = True

# Function to be called from JavaScript
def init_tictactoe_game():
    game = TicTacToe()
    cells = js.document.querySelectorAll('.tictactoe-cell')
    status_display = js.document.getElementById('tictactoe-status')
    
    def update_display():
        for i, cell in enumerate(cells):
            if game.board[i] == 'X':
                cell.innerHTML = '<span class="text-blue-500">X</span>'
            elif game.board[i] == 'O':
                cell.innerHTML = '<span class="text-red-500">O</span>'
            else:
                cell.innerHTML = ''
        
        if not game.game_active:
            if game.check_win():
                if game.current_player == 'X':
                    status_display.innerHTML = 'You won!'
                else:
                    status_display.innerHTML = 'Computer won!'
            else:
                status_display.innerHTML = 'Game ended in a draw!'
        else:
            if game.current_player == 'X':
                status_display.innerHTML = 'Your turn (X)'
            else:
                status_display.innerHTML = 'Computer\'s turn (O)'
    
    def handle_cell_click(event):
        if not game.game_active or game.current_player != 'X':
            return
        
        clicked_cell = event.target
        cell_index = js.Array.from(cells).indexOf(clicked_cell)
        
        if game.make_move(cell_index):
            update_display()
            
            # AI's turn
            if game.game_active:
                js.setTimeout(make_ai_move, 500)
    
    def make_ai_move():
        move = game.ai_move()
        if move >= 0:
            game.make_move(move)
            update_display()
    
    def reset_game():
        game.reset()
        update_display()
    
    # Set up event listeners
    for cell in cells:
        cell.addEventListener('click', handle_cell_click)
    
    js.document.getElementById('reset-tictactoe').addEventListener('click', reset_game)
    
    # Initialize display
    update_display()
    
    return game

# Export functions to be called from JavaScript
def get_tictactoe_game():
    return init_tictactoe_game()
