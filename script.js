class Game {
    constructor () {
        let canvas = document.getElementById('game-screen')
        let context = canvas.getContext('2d')
        let gameSize = { x: canvas.width, y: canvas.height }
        this.player = new Player(gameSize)
        let animate = () => {
            this.update()
            this.drawPlayer(context, gameSize) //will this hold true or need to be altered?
            // this.drawBullet()
            requestAnimationFrame(animate)
        }
        animate()
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
    
    // drawBullet () {
    
    // }

    // drawBomb () {

    // }

    // drawEnemy (context) {
    //     context.fillRect(startingXPosition, startingYPosition, playerWidth, playerHeight)
    // }

    // drawBonus () {

    // }
    update() {
        //use this to contain all objects
        this.player.update()
        // this.bullet.update()
        // this.enemy.update()
    }
}

class Player {
    constructor (gameSize) {
        this.size = { x: 20, y: 20 }
        this.center = { x:gameSize.x / 2, y: gameSize.y - this.size.y * 1 }
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
            // this.game.addBody(bullet)
        } 
    }
}

class Bullet {
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

// class Bomb {
//     constructor () {

//     }
// }

class Enemy {
    constructor (game) {
        this.game = game
        this.size = { x: 30, y: 30 }
        this.patrolY = 0
        this.speedY = 0.4
    }
    update () {
        if (this.patrolY < 0) {
            //want it to disappear if it passes the bottom
            //need it to replicate itself in random places
        }
    }
}

// class Bonus {
//     constructor () {

//     }
// }

new Game ()