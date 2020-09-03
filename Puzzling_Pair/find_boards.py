import z3
import numpy as np

if __name__ == '__main__':
    width = 9
    height = 9

    pattern = np.array([
[0, 1, 1, 1, 0, 1, 1, 1, 0],
[0, 1, 0, 1, 0, 1, 1, 0, 1],
[1, 1, 0, 1, 1, 1, 1, 1, 0],
[0, 1, 0, 1, 0, 1, 1, 0, 1],
[1, 0, 1, 1, 1, 0, 1, 0, 1],
[0, 1, 0, 1, 0, 1, 1, 1, 1],
[1, 1, 0, 0, 1, 0, 0, 1, 1],
[1, 0, 1, 1, 0, 1, 0, 1, 0],
[1, 1, 0, 0, 1, 0, 1, 1, 0],
    ])

    board_r, board_c = np.meshgrid(np.arange(width), np.arange(height))

    coords1 = np.char.add(np.char.add(np.cast[str](board_r), ','), np.cast[str](board_c))
    coords2 = np.char.add(np.char.add(np.char.add('1',np.cast[str](board_r)), ','), np.cast[str](board_c))
    flat_board1 = z3.Ints(coords1.ravel())
    flat_board2 = z3.Ints(coords2.ravel())
    board1 = np.reshape(flat_board1, coords1.shape)
    board2 = np.reshape(flat_board2, coords2.shape)

    for val in board2.ravel():
        val = '1'+val
    print(board1)
    print(board2)
    solver = z3.Solver()

    for var in board1.ravel():
        solver.add(var >= 1)
        solver.add(var <= 9)

    for var in board2.ravel():
        solver.add(var >= 1)
        solver.add(var <= 9)
    
    # Distinct rows & cols
    for i in range(9):
        solver.add(z3.Distinct(*board1[i,:].ravel()))
        solver.add(z3.Distinct(*board1[:,i].ravel()))
        solver.add(z3.Distinct(*board2[i,:].ravel()))
        solver.add(z3.Distinct(*board2[:,i].ravel()))

    # Distinct boxes
    for i in (0, 3, 6):
        for j in (0, 3, 6):
            solver.add(z3.Distinct(*board1[i:i+3,j:j+3].ravel()))
            solver.add(z3.Distinct(*board2[i:i+3,j:j+3].ravel()))

    # Differing / Shared Entries
    for i in range(9):
        for j in range(9):
            if pattern[i][j]==1:
                solver.add(z3.Distinct(board1[i][j], board2[i][j]))
            else:
                solver.add(board1[i][j] == board2[i][j])

    initial = np.array([
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
    '''
    for (val, var) in zip(initial.ravel(), board.ravel()):
        if val != 0:
            solver.add(var == int(val))
    '''
    result = solver.check()
    if result == z3.sat:
        print("Found solution")
        model = solver.model()
        vals1 = np.reshape([model.evaluate(i) for i in flat_board1], coords1.shape)
        print(vals1)
        vals2 = np.reshape([model.evaluate(i) for i in flat_board2], coords2.shape)
        print(vals2)
    else:
        print("No solution exists")