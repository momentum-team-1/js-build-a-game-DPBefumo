class Game {
    constructor () {
      let canvas = document.getElementById('space-invaders')
      let screen = canvas.getContext('2d')
      let gameSize = { x: canvas.width, y: canvas.height }
      this.bodies = []
      this.bodies = this.bodies.concat(createInvaders(this))
      this.bodies = this.bodies.concat(new Player(this, gameSize))

      this.shootSound = document.getElementById('shoot-sound')
  
      let tick = () => {
        this.update()
        this.draw(screen, gameSize)
        requestAnimationFrame(tick)
      }
      tick()
    }

    update () {
      // `notCollidingWithAnything` returns true if passed body
      // is not colliding with anything.
      let notCollidingWithAnything = (b1) => {
        return this.bodies.filter(function (b2) { return colliding(b1, b2) }).length === 0
      }
  
      // Throw away bodies that are colliding with something. They
      // will never be updated or draw again.
      this.bodies = this.bodies.filter(notCollidingWithAnything)
  
      // Call update on every body.
      for (let i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update()
      }
    }
  
    // **draw()** draws the game.
    draw (screen, gameSize) {
      // Clear away the drawing from the previous tick.
      screen.clearRect(0, 0, gameSize.x, gameSize.y)
  
      // Draw each body as a rectangle.
      for (let i = 0; i < this.bodies.length; i++) {
        drawRect(screen, this.bodies[i])
      }
    }
  
    // **invadersBelow()** returns true if `invader` is directly
    // above at least one other invader.
    invadersBelow (invader) {
      // If filtered array is not empty, there are invaders below.
      return this.bodies.filter(function (b) {
        // Keep `b` if it is an invader, if it is in the same column
        // as `invader`, and if it is somewhere below `invader`.
        return b instanceof Invader &&
            Math.abs(invader.center.x - b.center.x) < b.size.x &&
            b.center.y > invader.center.y
      }).length > 0
    }
  
    // **addBody()** adds a body to the bodies array.
    addBody (body) {
      this.bodies.push(body)
    }
  }
  
  // Invaders
  // --------
  
  // **new Invader()** creates an invader.
  class Invader {
    constructor (game, center) {
      this.game = game
      this.center = center
      this.size = { x: 15, y: 15 }
  
      // Invaders patrol from left to right and back again.
      // `this.patrolX` records the current (relative) position of the
      // invader in their patrol.  It starts at 0, increases to 40, then
      // decreases to 0, and so forth.
      this.patrolX = 0
  
      // The x speed of the invader.  A positive value moves the invader
      // right. A negative value moves it left.
      this.speedX = 0.3
    }
  
    // **update()** updates the state of the invader for a single tick.
    update () {
      // If the invader is outside the bounds of their patrol...
      if (this.patrolX < 0 || this.patrolX > 30) {
        // ... reverse direction of movement.
        this.speedX = -this.speedX
      }
  
      // If coin flip comes up and no friends below in this
      // invader's column...
      if (Math.random() > 0.995 &&
            !this.game.invadersBelow(this)) {
        // ... create a bullet just below the invader that will move
        // downward...
        let bullet = new Bullet({ x: this.center.x, y: this.center.y + this.size.y / 2 },
          { x: Math.random() - 0.5, y: 2 })
  
        // ... and add the bullet to the game.
        this.game.addBody(bullet)
      }
  
      // Move according to current x speed.
      this.center.x += this.speedX
  
      // Update letiable that keeps track of current position in patrol.
      this.patrolX += this.speedX
    }
  }
  
  // **createInvaders()** returns an array of twenty-four invaders.
  function createInvaders (game) {
    let invaders = []
    for (let i = 0; i < 24; i++) {
      // Place invaders in eight columns.
      let x = 30 + (i % 8) * 30
  
      // Place invaders in three rows.
      let y = 30 + (i % 3) * 30
  
      // Create invader.
      invaders.push(new Invader(game, { x: x, y: y }))
    }
  
    return invaders
  }

  class Player {
    constructor (game, gameSize) {
      this.game = game
      this.size = { x: 15, y: 15 }
      this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 2 }
      this.keyboarder = new Keyboarder()
    }
    update () {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.center.x -= 2
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.center.x += 2
      }
      if (this.keyboarder.isDown(this.keyboarder.KEYS.S)) {
        let bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.y - 10 },
          { x: 0, y: -7 })
  
        // ... add the bullet to the game...
        this.game.addBody(bullet)
  
        // ... rewind the shoot sound...
        this.game.shootSound.load()
  
        // ... and play the shoot sound.
        this.game.shootSound.play()
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
  
  // Other functions
  // ---------------
  
  // **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
  function drawRect (screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
      body.size.x, body.size.y)
  }
  
  // **colliding()** returns true if two passed bodies are colliding.
  // The approach is to test for five situations.  If any are true,
  // the bodies are definitely not colliding.  If none of them
  // are true, the bodies are colliding.
  // 1. b1 is the same body as b2.
  // 2. Right of `b1` is to the left of the left of `b2`.
  // 3. Bottom of `b1` is above the top of `b2`.
  // 4. Left of `b1` is to the right of the right of `b2`.
  // 5. Top of `b1` is below the bottom of `b2`.
  function colliding (b1, b2) {
    return !(
      b1 === b2 ||
          b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
          b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
          b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
          b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
    )
  }
  
  // Start game
  // ----------
  
  // When the DOM is ready, create (and start) the game.
  window.addEventListener('load', function () {
    new Game()
  })