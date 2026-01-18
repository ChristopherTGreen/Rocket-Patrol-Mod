class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
    
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        
        // add spaceships (3x)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        this.ship04 = new SpaceshipFast(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship-fast', 0, 40).setOrigin(0,0)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        
        // initialize score (or given prev score for two player mode)
        if (game.settings.gamePrevScore < 0) {
            this.p1Score = 0
        }
        else {
            this.p1Score = game.settings.gamePrevScore
        }
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier', 
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)

        // display second player's score bar (if two player mode selected)
        if (game.settings.gameTwoPlayers) {
            this.p2Score = 0
            this.scoreLeftTwo = this.add.text(game.config.width - borderUISize*3 - borderPadding*5, borderUISize + borderPadding*2, this.p2Score, scoreConfig)
        }
        
        // GAME OVER flag
        this.gameOver = false

        // play clock (either 45-60)
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            if (game.settings.gamePrevScore >= 0) {
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            }
            else {
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) for Player Two', scoreConfig).setOrigin(0.5)
            }
            this.gameOver = true
        }, null, this)

        // display time
        let timeConfig = {
            fontFamily: 'Courier', 
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(game.config.width/2 - borderPadding - borderUISize, borderUISize + borderPadding*2, Math.floor(this.time/100), timeConfig)
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            if(game.settings.gamePrevScore >= 0 || !game.settings.gameTwoPlayers) {
                game.settings.gamePrevScore = -1
                console.log(game.settings.gamePrevScore)
                this.scene.restart()
            }
            else if(game.settings.gamePrevScore < 0) {
                console.log(game.settings.gamePrevScore)
                console.log(this.p1Score)
                game.settings.gamePrevScore = this.p1Score
                this.scene.restart()
            }
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT) && game.settings.gamePrevScore < 0) {
            this.scene.start("menuScene")
        }

        this.starfield.tilePositionX -= 4

        if(!this.gameOver) {
            this.p1Rocket.update()          // update rocket sprite
            this.ship01.update()            // update spaceships (3x)
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()            // update fast spacership
            // update timer text
            this.timeLeft.text = Math.ceil(this.clock.delay/1000 - this.clock.elapsed/1000)
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        else if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        else if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        else if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
        }
        else if(this.p1Rocket.y < borderUISize * 3 + borderPadding+1) {
            // if miss, will deduct time
            this.clock.delay -= 1000
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')              // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset()                        // reset ship position
            ship.alpha = 1                      // make ship visible again
            boom.destroy()                      // remove explosion sprite
        })
        // score add, time add, and text update (dependent on player)
        if (game.settings.gamePrevScore < 0) {
            this.p1Score += ship.points
            this.scoreLeft.text = this.p1Score
        }
        else {
            this.p2Score += ship.points
            this.scoreLeftTwo.text = this.p2Score
        }
        this.clock.delay += 1000
        this.sound.play('sfx-explosion')
    }
}