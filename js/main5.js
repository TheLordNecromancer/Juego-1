// Juego EarthEater

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'contenedor',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let planets = [];
let blackHoles = [];
let score = 0;
let scoreText;
let vida = 3;
let vidaText;
let textoPerder;
let gameOver = false;
let damageCooldown = false;

function preload() {
    this.load.image('fondo', 'assets/bg/bg_layer2.png');

    this.load.image('planet', 'assets/entities/planet/planet_1.png');
    this.load.image('blackHole', 'assets/entities/blackHole/blackHole.png');
    this.load.image('hurt_frame', 'assets/entities/player/hurt/hurt_1.png');

    // Frames de vuelo
    this.load.image('fly_1', 'assets/entities/player/fly/fly_1.png');
    this.load.image('fly_2', 'assets/entities/player/fly/fly_2.png');
    this.load.image('fly_3', 'assets/entities/player/fly/fly_3.png');
    this.load.image('fly_4', 'assets/entities/player/fly/fly_4.png');
    this.load.image('fly_5', 'assets/entities/player/fly/fly_5.png');
    this.load.image('fly_6', 'assets/entities/player/fly/fly_6.png');

    // Frames de muerte
    this.load.image('death_1', 'assets/entities/player/death/death_1.png');
    this.load.image('death_2', 'assets/entities/player/death/death_2.png');
    this.load.image('death_3', 'assets/entities/player/death/death_3.png');
    this.load.image('death_4', 'assets/entities/player/death/death_4.png');
    this.load.image('death_5', 'assets/entities/player/death/death_5.png');
    this.load.image('death_6', 'assets/entities/player/death/death_6.png');
}

function create() {
    let background = this.add.image(400, 300, 'fondo');
    background.setDisplaySize(800, 600);
    background.setDepth(-1);

    player = this.add.sprite(400, 300, 'fly_1');
    player.setScale(0.8);
    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'volar',
        frames: [
            { key: 'fly_1' },
            { key: 'fly_2' },
            { key: 'fly_3' },
            { key: 'fly_4' },
            { key: 'fly_5' },
            { key: 'fly_6' }
        ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'morir',
        frames: [
            { key: 'death_1' },
            { key: 'death_2' },
            { key: 'death_3' },
            { key: 'death_4' },
            { key: 'death_5' },
            { key: 'death_6' }
        ],
        frameRate: 8,
        repeat: 0
    });

    createPlanet.call(this);
    createBlackHole.call(this);
    addScore.call(this);
}

function update() {
    if (!gameOver) {
        playerMovement();
        stopPlayerOutOfBounds();
        planetMovement();
        blackHoleMovement();
        catchPlanet.call(this);
        catchBlackHole.call(this);

        if (vida <= 0) {
            playerLose.call(this);
        }
    }
}

function playerMovement() {
    if (cursors.left.isDown) {
        player.x -= 8;
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.x += 8;
        player.flipX = false;
    }

    if (cursors.up.isDown) {
        player.y -= 8;
    } else if (cursors.down.isDown) {
        player.y += 8;
    }

    player.play('volar', true);
}

function playerLose() {
    gameOver = true;
    player.play('morir', true);
    textoPerder = this.add.text(400, 300, 'HAS PERDIDO', {
        fontSize: '40px',
        fill: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);
}

// --- Funciones de apoyo ---

function createPlanet() {
    for (let i = 0; i < 5; i++) {
        let planet = this.add.image(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'planet');
        planet.setScale(0.8);
        setPlanetMovement(planet);
        planets.push(planet);
    }
}

function setPlanetMovement(planet) {
    planet.vx = Phaser.Math.Between(-2, 2);
    planet.vy = Phaser.Math.Between(-2, 2);
}

function createBlackHole() {
    for (let i = 0; i < 3; i++) {
        let blackHole = this.add.image(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'blackHole');
        blackHole.setScale(0.5);
        setBlackHoleMovement(blackHole);
        blackHoles.push(blackHole);
    }
}

function setBlackHoleMovement(blackHole) {
    blackHole.vx = Phaser.Math.Between(-2, 2);
    blackHole.vy = Phaser.Math.Between(-2, 2);
}

function addScore() {
    scoreText = this.add.text(10, 10, 'Puntos: 0', { fontSize: '20px', fill: '#ffffff' });
    vidaText = this.add.text(10, 40, 'Vida: ' + vida, { fontSize: '20px', fill: '#ffffff' });
}

function stopPlayerOutOfBounds() {
    player.x = Phaser.Math.Clamp(player.x, 20, 780);
    player.y = Phaser.Math.Clamp(player.y, 20, 580);
}

function planetMovement() {
    planets.forEach(planet => {
        planet.x += planet.vx;
        planet.y += planet.vy;
        if (Math.random() < 0.02) setPlanetMovement(planet);
        planet.x = Phaser.Math.Clamp(planet.x, 20, 780);
        planet.y = Phaser.Math.Clamp(planet.y, 20, 580);
    });
}

function blackHoleMovement() {
    blackHoles.forEach(bh => {
        bh.x += bh.vx;
        bh.y += bh.vy;
        if (Math.random() < 0.02) setBlackHoleMovement(bh);
        bh.x = Phaser.Math.Clamp(bh.x, 20, 780);
        bh.y = Phaser.Math.Clamp(bh.y, 20, 580);
    });
}

function catchPlanet() {
    planets.forEach(planet => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), planet.getBounds())) {
            score++;
            scoreText.setText('Puntos: ' + score);
            planet.x = Phaser.Math.Between(50, 750);
            planet.y = Phaser.Math.Between(50, 550);
        }
    });
}

function catchBlackHole() {
    if (damageCooldown) return;

    blackHoles.forEach(blackHole => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), blackHole.getBounds())) {
            vida--;
            vidaText.setText('Vida: ' + vida);
            damageCooldown = true;

            player.setTint(0xffffff);
            
            this.tweens.add({
                targets: player,
                alpha: 0.1,
                duration: 100,
                ease: 'Linear',
                yoyo: true,
                repeat: 5
            });

            this.time.delayedCall(1500, () => {
                damageCooldown = false;
                player.clearTint();
                player.alpha = 1;
            }, [], this);

            player.x = 400;
            player.y = 300;
        }
    });
}