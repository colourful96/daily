let gameStatus = 'pause';
let gameing = false;
let speed = 200;
let snakeTimer = null;

const startDOM = document.getElementsByClassName('start')[0];
const wrapperDOM = document.getElementsByClassName('wrapper')[0];
const numberDOM = document.getElementsByClassName('number')[0];

init();
function init() {
	// 地图
	this.mapW = document.documentElement.clientWidth;
	this.mapH = document.documentElement.clientHeight - 30;
	// 食物
	this.foodW = 20;
	this.foodH = 20;
	this.foodX = 0;
	this.foodY = 0;
	this.foodColor = '#00F';
	//蛇属性
	this.snake;
	this.snakeW = 20;
	this.snakeH = 20;
	this.snakeBody = [
		[3, 0, 'head'],
		[2, 0, 'body'],
		[1, 0, 'body'],
	];

	//游戏属性
	this.direct = 'right';
	this.left = false;
	this.right = false;
	this.up = true;
	this.down = true;
	// 分数
	this.score = 0;
	bindEvent();
}

function bindEvent() {
	startDOM.addEventListener('click', function () {
		startAndPauseGame();
	});
}

// 食物
function food() {
	const food = document.createElement('div');
	food.style.width = this.foodW + 'px';
	food.style.height = this.foodH + 'px';

	this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW));
	this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH));

	food.style.left = this.foodX * this.foodW + 'px';
	food.style.top = this.foodY * this.foodH + 'px';
	food.style.background = this.foodColor;
	food.style.position = 'absolute';
	wrapperDOM.appendChild(food).setAttribute('class', 'food');
}

// 蛇
function snake() {
	for (let i = 0; i < this.snakeBody.length; i++) {
		const snake = document.createElement('div');
		snake.style.width = this.snakeW + 'px';
		snake.style.height = this.snakeH + 'px';
		snake.style.position = 'absolute';
		snake.style.left = this.snakeBody[i][0] * this.snakeW + 'px';
		snake.style.top = this.snakeBody[i][1] * this.snakeH + 'px';
		snake.classList.add(this.snakeBody[i][2]);
		wrapperDOM.appendChild(snake).classList.add('snake');
		switch (this.direct) {
			case 'right':
				break;
			case 'up':
				snake.style.transform = 'rotate(270deg)';
				break;
			case 'left':
				snake.style.transform = 'rotate(180deg)';
				break;
			case 'down':
				snake.style.transform = 'rotate(90deg)';
				break;
			default:
				break;
		}
	}
}
// 根据类名移除元素
function removeClass(className) {
	const ele = document.getElementsByClassName(className);
	while (ele.length > 0) {
		ele[0].parentNode.removeChild(ele[0]);
	}
}

function move() {
	// 蛇身位置
	for (let i = this.snakeBody.length - 1; i > 0; i--) {
		this.snakeBody[i][0] = this.snakeBody[i - 1][0];
		this.snakeBody[i][1] = this.snakeBody[i - 1][1];
	}
	switch (this.direct) {
		case 'right':
			this.snakeBody[0][0] += 1;
			break;
		case 'up':
			this.snakeBody[0][1] -= 1;
			break;
		case 'left':
			this.snakeBody[0][0] -= 1;
			break;
		case 'down':
			this.snakeBody[0][1] += 1;
			break;
		default:
			break;
	}
	removeClass('snake');
	snake();

	// 吃到食物
	if (
		this.snakeBody[0][0] === this.foodX &&
		this.snakeBody[0][1] === this.foodY
	) {
		const snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
		const snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
		switch (this.direct) {
			case 'right':
				this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
				break;
			case 'up':
				this.snakeBody.push([snakeEndX, snakeEndX - 1, 'body']);
				break;
			case 'left':
				this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body']);
				break;
			case 'down':
				this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body']);
				break;
			default:
				break;
		}
		this.score += 1;
		numberDOM.innerHTML = this.score;
		removeClass('food');
		food();
	}
	// 撞到边界
	if (
		this.snakeBody[0][1] < 0 ||
		this.snakeBody[0][1] >= this.mapH / this.snakeH
	) {
		reloadGame();
	}
	if (
		this.snakeBody[0][0] < 0 ||
		this.snakeBody[0][0] >= this.mapW / this.snakeW
	) {
		reloadGame();
	}

	// 撞到自己
	const snakeHeaderX = this.snakeBody[0][0];

	const snakeHeaderY = this.snakeBody[0][1];
	for (let i = 1; i < this.snakeBody.length; i++) {
		const snakeBodyX = this.snakeBody[i][0];
		const snakeBodyY = this.snakeBody[i][1];
		if (snakeHeaderX == snakeBodyX && snakeHeaderY == snakeBodyY) {
			this.reloadGame();
		}
	}
}

// 重新加载
function reloadGame() {
	removeClass('snake');
	removeClass('food');
	clearInterval(snakeTimer);
	this.snakeBody = [
		[3, 2, 'head'],
		[2, 2, 'body'],
		[1, 2, 'body'],
	];
	this.direct = 'right';
	this.left = false;
	this.right = false;
	this.up = true;
	this.down = true;
	gameStatus = 'pause';
	window.prompt(`失败 分数为${this.score}`);
	this.score = 0;
    numberDOM.innerHTML = 0;
	startDOM.innerHTML = '开始';
}

// 设置移动方向
function setDirect(code) {
	console.log(code, 'code');
	switch (code) {
		case 'ArrowUp':
			if (this.up) {
				this.direct = 'up';
				this.left = true;
				this.right = true;
				this.up = false;
				this.down = false;
			}
			break;
		case 'ArrowDown':
			if (this.down) {
				this.direct = 'down';
				this.left = true;
				this.right = true;
				this.up = false;
				this.down = false;
			}
			break;
		case 'ArrowLeft':
			if (this.left) {
				this.direct = 'left';
				this.left = false;
				this.right = false;
				this.up = true;
				this.down = true;
			}
			break;
		case 'ArrowRight':
			if (this.right) {
				this.direct = 'right';
				this.left = false;
				this.right = false;
				this.up = true;
				this.down = true;
			}
			break;
		default:
			break;
	}
}

// 开始游戏
function startGame() {
	food();
	snake();
}

// 开始暂停游戏
function startAndPauseGame() {
	if (gameStatus === 'pause') {
		if (!gameing) {
			// 开始
			startGame();
			gameing = true;
		}
		gameStatus = 'play';
		gameing = true;
		startDOM.innerText = '暂停';
		snakeTimer = setInterval(() => {
			move();
		}, speed);
		document.addEventListener('keydown', function (e) {
			const code = e.code;
			setDirect(code);
		});
	} else {
		// 暂停
		clearInterval(snakeTimer);
		document.addEventListener('keydown', function (e) {
			e.preventDefault();
			return false;
		});
		startDOM.innerText = '开始';
		gameStatus = 'pause';
	}
}
