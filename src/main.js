// Christopher Green
// Rocket Patrol: Stars of Chaos
// 11 Hours
// Mods Chosen
//      
//      Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
//          Note: Created a smaller spaceship called spaceship-fast, with small difference in artwork, more curved, and slightly smaller pixel size.  Also, it wraps around at random.
//      Implement an alternating two-player mode (5)
//          Note: There is an optionary selection at the beginning, which either toggles one or two players, and repeats the setting until player returns to menu.
//      Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
//          Note: Destroying a ship only adds 1 second, missing only loses 1 second.
//      Implement mouse control for player movement and left mouse click to fire (5)
//          Note: Mouse control only works when mouse is on the canvas and override primary controls unless the mouse is not on the canvas.
//      Display the time remaining (in seconds) on the screen (3)
//          Note: This is extra, since points would be 23. I only added this to make the new timing/scoring mechanic more clear.
// Citations: None
//
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3