class Game {
    constructor () { //variasbles for the game
        let canvas = document.getElementById('game-screen')
        let context = canvas.getContext('2d')
        let gameSize = { x: canvas.width, y: canvas.height }
        
        this.gameElements = []
        this.gameElements = this.gameElements.concat(createEnemy(this))
        this.gameElements = this.gameElements.concat(new Player(this, gameSize)) 
        
        let tick = () => {
            this.update()
            this.draw(context, gameSize)
            requestAnimationFrame(tick)
        }
        tick()
    }
    
    update() {
        //not colliding function needs to be added
        for (let i = 0; i < this.gameElements.length; i++) {
            this.gameElements[i].update() 
        }
    }

    draw(context, gameSize) {
        context.clearRect(0, 0, gameSize.x, gameSize.y)
        for (let i = 0; i < this.gameElements.length; i++) {
            drawRect(context, this.gameElements[i])
        }
    }

    addEl (newEl) {
        this.gameElements.push(newEl)
    }
}

class Enemy {
    constructor (game, center) { 
        this.game = game
        this.center = center
        this.size = { x: 15, y: 15 }
        this.patrolY = -0
        this.speedY= 0.6
    }
    update () {
        if (this.patrolY < -10 || this.patrolY > 530) {
            this.speedY += -this.speedY
        }
        this.center.y += this.speedY
        this.patrolY += this.speedY
    }
}

function createEnemy (game) {
    let enemy = []
    for (let i = 0; i < 200; i++) {
        let x = Math.random() * 300
        let y = Math.random() * 0
        enemy.push(new Enemy(game, { x: x, y: y}))
    }
    return enemy
}

class Player {
    constructor (game, gameSize) {
        this.game = game
        this.size = { x: 20, y: 20 }
        this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * .75 }
        this.keyboarder = Keyboarder
    }
    update () {//how do I make the player not go off screen?
        if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
            this.center.x += 2
        } else if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
            this.center.x -= 2
        } //how to add in the bullet?
        if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
            let bullet = new Bullet ({ x: this.center.x, y: this.center.y - this.size.y - 10},
            { x: 0, y: -5})
            this.game.gameElements.push(bullet)
        }
    }
}

class Bullet {
    constructor(center, velocity) {      
        this.center = center
        this.size = { x: 3, y: 3 }
        this.velocity = velocity
    }
    update () {
        this.center.x += this.velocity.x
        this.center.y += this.velocity.y
    }
}

function drawRect(context, newEl) {
    context.fillRect(newEl.center.x - newEl.size.x / 2, newEl.center.y - newEl.size.y / 2, newEl.size.x, newEl.size.y)
}

function collinding (b1, b2) {
    return !(
        b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 
    )
}

new Game ()