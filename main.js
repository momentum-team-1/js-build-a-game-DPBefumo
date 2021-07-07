const playerImg = 'https://png2.cleanpng.com/sh/a03602af49d66801d666dc983aa61a0d/L0KzQYm3V8AzN6h9gpH0aYP2gLBuTgNxaZRqeARqZoSwg8H5igRmNWNpRdV4bYD4hLb5TfdzaaFtgdV8LXPvccTvTf9nNaVmRadrM3HmSYO7gBJiQZc7RqoDOUS6QoO9UcU0OGY8UaQ8Nki2RIO1kP5o/kisspng-spacecraft-sprite-2d-computer-graphics-clash-of-ta-5b3ac924cba9f6.8894722615305792368342.png'
const enemyImg = 'https://png2.cleanpng.com/sh/686eb70fd83129aa4dc57ca8b438b924/L0KzQYm3VsE0N5xse5H0aYP2gLBuTgBieJZ3RdN8dHX1f7rrTgN1cZRwfeQ2YXTrdcTwlvUueJ1mhtd9LXH2hLb5jBlle146eqQ5ZnXkRIrrWcY4QF83Uas6MEe2RYK8Usg5QGkAUagBNEW4PsH1h5==/kisspng-paper-asteroid-sticker-adhesive-planet-asteroids-5b20fea49d9678.2991073515288889966455.png'

class Game {
    constructor () {
        let canvas = document.getElementById('game-screen')
        let context = canvas.getContext('2d')
        let gameSize = { x: canvas.width, y: canvas.height }
        
        this.gameElements = []
        this.gameElements = this.gameElements.concat(createEnemy(this))
        this.gameElements = this.gameElements.concat(new Player(this, gameSize)) 
        
        let tick = () => {
            if (this.gameElements.length < 1000) {
                this.gameElements = this.gameElements.concat(createEnemy(this))
            }
            this.update()
            this.draw(context, gameSize)
            requestAnimationFrame(tick)
        }
        tick()
    }

    update() {
        let noContact = (b1) => {
            return this.gameElements.filter(function (b2) { return contact(b1, b2) }).length === 0
        }
        this.gameElements = this.gameElements.filter(noContact)

        for (let i = 0; i < this.gameElements.length; i++) {
            this.gameElements[i].update() 
        }
    }

    draw(context, gameSize) {
        context.clearRect(0, 0, gameSize.x, gameSize.y)
        for (let i = 0; i < this.gameElements.length; i++) {
            if (this.gameElements[i] instanceof Bullet) {
            drawRect(context, this.gameElements[i], '#a32a05')
        } else if(this.gameElements[i] instanceof Enemy) {
                drawRect(context, this.gameElements[i], '#7d807e')
        } else if(this.gameElements[i] instanceof Player) {
            drawRect(context, this.gameElements[i], '#7998d4')
        } else {
            drawRect(context, this.gameElements[i])
            }
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
        this.size = { x: 20, y: 20 }
        this.patrolY = 0
        this.speedY= Math.random() * 5
    }
    update () {
        if (this.patrolY < -10 || this.patrolY > 640) {
            this.speedY += -this.speedY
        }
        this.center.y += this.speedY
        this.patrolY += this.speedY
    }
}

function createEnemy (game) {
    let enemy = []
    for (let i = 0; i < 1; i++) {
        let x = Math.random() * 300
        let y = -80
        enemy.push(new Enemy(game, { x: x, y: y}))
    }
    return enemy
}

class Player {
    constructor (game, gameSize) {
        this.game = game
        this.size = { x: 20, y: 20 }
        this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * .75 }
        this.image = playerImg
        this.keyboarder = Keyboarder
    }
    update () {
        if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
            this.center.x += 2
        } else if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
            this.center.x -= 2
        }
        if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
            let bullet = new Bullet ({ x: this.center.x, y: this.center.y - this.size.y - 10},
            { x: 0, y: -5})
            this.game.gameElements.push(bullet)
        }
        if (this.center.x < 0) {
            this.center.x = 0
        }
        if (this.center.x > 290) {
            this.center.x = 290
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

function drawRect(screen, body, color) {
    let oldStyle = screen.fillStyle
    screen.fillStyle = color
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
        body.size.x, body.size.y)
    screen.fillStyle = oldStyle
}
function contact (b1, b2) {
    return !(
        b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 
    )
}

window.addEventListener('load', function () {
    new Game()
})
// const newGame = document.querySelector('.start-button')
// newGame.addEventListener('submit', function () {
//     console.log('workin?')
//     new Game ()
// })