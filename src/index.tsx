import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

enum Players {
	Cross = 'X',
	Nought = 'O',
}

type SquareValue = Players | null

type BoardState = SquareValue[]

type HistoryItem = { squares: BoardState }


interface SquareProps {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	value: SquareValue
}

function Square (props: SquareProps) {
	return (
      <button
      	className="square"
      	onClick={props.onClick}
    	>
        {props.value}
      </button>
	)
}


interface BoardProps {
	onClick: (index: number) => void
	squares: SquareValue[]
}

class Board extends React.Component<BoardProps> {
  renderSquare(index: number) {
    return (
    	<Square
    		onClick={() => this.props.onClick(index)}
    		value={this.props.squares[index]}
	    />
		)
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

interface GameProps {

}

interface GameState {
	history: HistoryItem[]
	isXNext: boolean
	stepNumber: number
}

class Game extends React.Component<GameProps, GameState> {
	constructor(props: GameProps) {
		super(props)
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			isXNext: true,
			stepNumber: 0,
		}

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(index: number): void {
		const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    // if we have a winner
    if(calculateWinner(squares)) return 
    // if a player already played that square
    if(squares[index]) return

    squares[index] = this.state.isXNext
    	? Players.Cross
    	: Players.Nought

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      isXNext: !this.state.isXNext,
      stepNumber: history.length,
    });		
	}

	jumpTo(step: number): void {
		this.setState({
			stepNumber: step,
			isXNext: step % 2 === 0,
		})
	}

  render() {
  	const {
  		history,
  		isXNext,
  		stepNumber,
		} = this.state
  	const current = history[stepNumber]
		const winner = calculateWinner(current.squares)
		const nextPlayer = isXNext
			? Players.Cross
			: Players.Nought

    const moves = history.map((step, move) => {
      const desc = move
      	? 'Go to move #' + move 
      	: 'Go to game start'
      return (
        <li
        	key={`move-${move}`}
        >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

		const status = winner
			? `Winner: ${winner}`
			: `Next player: ${nextPlayer}`

    return (
      <div className="game">
        <div className="game-board">
          <Board
          	onClick={(index: number) => this.handleClick(index)}
          	squares={current.squares}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares: BoardState): SquareValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}