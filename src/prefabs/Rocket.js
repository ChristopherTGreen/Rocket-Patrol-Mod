// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing, displayList, updatelist
        this.isFiring = false       // track rocket's firing status
        this.moveSpeed = 2          // rocket speed in pixels/frame
        this.sfxShot = scene.sound.add('sfx-shot')
 
        
    }

    update() {
        // mouse movement (incase mouse is on screen)
        // left/right movement
        if(!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.moveLeft()
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.moveRight()
            }
        }
        // fire button
        if((Phaser.Input.Keyboard.JustDown(keyFIRE)) && !this.isFiring) {
            this.fire()
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false
            this.y = game.config.height - borderUISize - borderPadding
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }

    // fires rocket
    fire() {
        this.isFiring = true
        this.sfxShot.play()
    }

    // movement left
    moveLeft() {
        if (this.isFiring) return
        this.x -= this.moveSpeed
    }
    
    // movement right
    moveRight() {
        if (this.isFiring) return
        this.x += this.moveSpeed
    }
}