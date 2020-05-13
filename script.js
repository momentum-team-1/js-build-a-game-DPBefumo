class Game {
    constructor () {
        let canvas = document.getElementById('game-screen')
        let context = canvas.getContext('2d')
        let gameSize = { x: canvas.width, y: canvas.height }
        this.player = new Player(gameSize)
        this.ememy = new Enemy(game, center)// what argument should be here?
        let animate = () => {
            this.update()
            this.drawPlayer(context, gameSize) 
            this.drawEnemy(context)// what argument should be here?
            requestAnimationFrame(animate)
        }
        animate()
    }

    update() {
        //use this to contain all objects
        this.player.update()
        // this.bullet.update()
        this.enemy.update() //Uncaught TypeError: Cannot read property 'update' of undefined keeps popping up

    }

    drawPlayer (context, gameSize) {
        context.clearRect(0, 0, gameSize.x, gameSize.y)
        context.fillstyle = '#4287f5'
        let startingXPosition = this.player.center.x - this.player.size.x / 2
        let startingYPosition = this.player.center.y - this.player.size.y / 2
        let playerWidth = this.player.size.x
        let playerHeight = this.player.size.y
        context.fillRect(startingXPosition, startingYPosition, playerWidth, playerHeight)
    }

    drawEnemy (context) { //make them random starting positons
        context.fillystyle = 'red'
        context.fillRect(30, -10, 25, 25)
        context.fillRect(80, -10, 25, 25)
        context.fillRect(130, -10, 25, 25)
        context.fillRect(180, -10, 25, 25)
        context.fillRect(230, -10, 25, 25)
    }

    //draw bullet
    //draw bonus
    //draw bomb

    //need to take score
    //need to count down lives
    //need to have an end to game when out of lives
}

class Player {
    constructor (gameSize) {
        this.size = { x: 20, y: 20 }
        this.center = { x:gameSize.x / 2, y: gameSize.y - this.size.y * 1 }
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
        } 
    }
}

class Bullet { //not sure if this even works
    constructor (center, velocity) {
        this.center = center
        this.size = { x: 3, y: 3 }
        this.velocity = velocity
    }
    update () {
        this.center.x += this.velocity.x
        this.center.y += this.velocity.y
    }
}

class Enemy { //need to make the enemies move!
    constructor (game, center) { // is this even the correct argument to bring in?
        this.game = game
        this.center = center //may be unneeded since the update is running off of gravity speed
        // this.size = { x: 30, y: 30 }
        this.patrolY = 0
        this.speedX = 0
        this.speedY = 0
        this.gravity = 0.05
        this.gravitySpeed = 0
    }
      //want it to disappear if it passes the bottom
      //need it to replicate itself in random places
    update () {
        if (this.patrolY > 0) {
            console.log('is this working?')
            this.gravitySpeed += this.gravity
            this.x += this.speedX
            this.y += this.speedY + this.gravitySpeed
        }
    }
}

// create a bomb class
// create a bonus class


new Game ()