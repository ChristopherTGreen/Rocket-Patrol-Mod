// Faster Spaceship prefab
class SpaceshipFast extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointvalue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)    // add to existing scene
        this.points = pointvalue    // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed *1.5       // spaceship speed in pixels/frame
        this.min = Math.ceil(borderUISize * 4)
        this.max = Math.floor(borderUISize*6 + borderPadding*4)
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed
        
        // wrap from left to right edge
        if(this.x <= 0 - this.width) {
            this.x = game.config.width
            this.y = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
        }
    }

    //reset position
    reset() {
        this.x = game.config.width
    }
}