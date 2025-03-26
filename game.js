const canvas = document.getElementById("game")

const ctx = canvas.getContext("2d")

const ground = new Image()
ground.src = "img/ground.png"

const foodImg = new Image()
foodImg.src = "img/food.png"

const bombImg = new Image()
bombImg.src = "img/bomb.png"

const coinImg = new Image()
coinImg.src = "img/coin.png"

let box = 32

let bomb = [{}]

let coin = [{}]

let snake = []
snake[0] = {
	x: 9 * box,
	y: 10 * box
}

let food = {
	x: Math.floor((Math.random() * 17 + 1)) * box,
	y: Math.floor((Math.random() * 15 + 3)) * box
}

let score = snake.length - 1

let money = 0

document.addEventListener("keydown", direction)

let dir

function direction(event) {
	if (event.keyCode == 37 && dir != "right") dir = "left"
	else if (event.keyCode == 38 && dir != "down") dir = "up"
	else if (event.keyCode == 39 && dir != "left") dir = "right"
	else if (event.keyCode == 40 && dir != "up") dir = "down"
}

let enemySnake = []
enemySnake[0] = {
	x: 18 * box,
	y: Math.floor((Math.random() * 15 + 3)) * box
}

for (let i = 1; i < Math.random(5, 25) * box; i++) {
	enemySnake[i] = {
		x: (18 + i) * box,
		y: enemySnake[0].y
	}
}

let enemySnakeX = enemySnake[0].x
let enemySnakeY = enemySnake[0].y

const openMenuButton = document.getElementById('openMenu')
const menu = document.getElementById('menu')
const gameButton = document.getElementById('gameButton')
const shopButton = document.getElementById('shopButton')

function closeMenu() {
    menu.classList.remove('visible');
    setTimeout(() => {
        menu.classList.add('hidden');
    }, 500)
}

function openMenu() {
	clearInterval(game)
	menu.classList.remove('hidden');
    setTimeout(() => {
        menu.classList.add('visible');
    }, 500)
}

openMenuButton.addEventListener('click', () => {
	openMenu()
})

gameButton.addEventListener('click', () => {
    closeMenu()
	location.reload()
})

shopButton.addEventListener('click', () => {
    closeMenu()
})

function drawGame() {
	ctx.drawImage(ground, 0, 0)

	ctx.drawImage(foodImg, food.x, food.y)

	for ( let i = 0; i < bomb.length; i++)
		ctx.drawImage(bombImg, bomb[i].x, bomb[i].y)

	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i == 0 ? "darkgreen" : "green"
		ctx.fillRect(snake[i].x, snake[i].y, box, box)
	}

	let snakeX = snake[0].x
	let snakeY = snake[0].y

	if (dir == "left") snakeX -= box
	if (dir == "right") snakeX += box
	if (dir == "up") snakeY -= box
	if (dir == "down") snakeY += box

	let newHead = {
		x: snakeX,
		y: snakeY
	}

	snake.unshift(newHead)
	
	if (snakeX == food.x && snakeY == food.y) {
		score++
		food = {
			x: Math.floor((Math.random() * 17 + 1)) * box,
			y: Math.floor((Math.random() * 15 + 3)) * box
		}
	} 
	else
	    snake.pop()

	enemySnakeX = enemySnake[0].x
	enemySnakeY = enemySnake[0].y

	if(enemySnakeX == box * 5) {
		coin.push({
			x: Math.floor((Math.random() * 17 + 1)) * box,
			y: Math.floor((Math.random() * 15 + 3)) * box
		})
	}

	for ( let i = 0; i < coin.length; i++)
		ctx.drawImage(coinImg, coin[i].x, coin[i].y)

	for(let i = 0; i < coin.length; i++) {
		if(snakeX == coin[i].x && snakeY == coin[i].y) {
			money++
			coin.splice(i, 1, '')
		}
	}

    if(enemySnakeX == box || enemySnake.length == 0) {
		bomb.push({
			x: Math.floor((Math.random() * 17 + 1)) * box,
			y: Math.floor((Math.random() * 15 + 3)) * box
		})
	}

	if(bomb.length > 4)
		bomb.shift()

	if (score > 0 && snake.length < 20) {
		for (let i = 0; i < enemySnake.length; i++) {
			ctx.fillStyle = "red"
			ctx.fillRect(enemySnake[i].x, enemySnake[i].y, box, box)
			enemySnake[i].x -= box

			if (enemySnake[enemySnake.length - 1].x < -2000)
				enemySnake.pop()
		}
	}

	for (let i = 0; i < snake.length; i++) {
		if (enemySnakeX == snake[i].x && enemySnakeY == snake[i].y) {
			snake.splice(i)
			score -= i
		}

		for (let y = 0; y < enemySnake.length; y++) {
			if (snakeX == enemySnake[y].x && snakeY == enemySnake[y].y) {
				enemySnake.splice(y)
				score += y
			}
		}

			if (enemySnake[enemySnake.length - 1].x < -2000 && enemySnakeY != snake[i]) {
				enemySnake[0] = {
				x: 18 * box,
				y: Math.floor((Math.random() * 15 + 3)) * box
			    }

		    for (let i = 1; i < Math.random(5, 25) * box; i++) {
			    enemySnake[i] = {
				    x: (18 + i) * box,
				    y: enemySnake[0].y
				}
			}
		}
	}

	if (snakeX === enemySnakeX && snakeY === enemySnakeY) {
		openMenu()
	}

	if (snake.length < 1) {
		openMenu()
	}

	if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) {
		openMenu()
	}

	for(let i = 0; i < bomb.length; i++) {
		if(snakeX == bomb[i].x && snakeY == bomb[i].y) {
			openMenu()
		}
	}

	for (let i = 2; i < snake.length; i++) {
		if (snakeX == snake[i].x && snakeY == snake[i].y) {
		    openMenu()
		}
	}

	ctx.fillStyle = "#578a34"
	ctx.fillRect(0, box * 3, box, box * 15)
	ctx.fillRect(box * 18, box * 3, box, box * 15)
	ctx.fillRect(0, box * 2, box * 19, box)
	ctx.fillRect(0, box * 18, box * 19, box)

	ctx.fillStyle = "#4a752c"
	ctx.fillRect(0, 0, box * 19, box * 2.2)
	ctx.drawImage(foodImg, box, box / 1.8)

	ctx.fillStyle = "white"
	ctx.font = "50px Arial"
	ctx.fillText(score, box * 2.2, box * 1.7)

	ctx.fillStyle = "#4a752c"
	ctx.drawImage(coinImg, box * 5.5, box / 1.5)

	ctx.fillStyle = "white"
	ctx.font = "50px Arial"
	ctx.fillText(money, box * 6.6, box * 1.7)
}

let game = setInterval(drawGame, 100)