// Juego caza planetas

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

// Variables globales
let player;
let cursors;
let planets = [];
let blackHoles = [];
let score = 0;
let scoreText;
let vida = 3;
let vidaText;
let textoPerder;

function preload() {
    // Nota: Usamos el mismo asset para todo según tu código original
    this.load.image('player', 'assets/entities/player/fly/fly_1.png');
    this.load.image('planet', 'assets/entities/planet/planet_1.png');
    this.load.image('blackHole', 'assets/entities/blackHole/blackHole.png');

    this.load.image('fly_1', 'assets/entities/player/fly/fly_1.png');
    this.load.image('fly_2', 'assets/entities/player/fly/fly_2.png');
    this.load.image('fly_3', 'assets/entities/player/fly/fly_3.png');
    this.load.image('fly_4', 'assets/entities/player/fly/fly_4.png');
    this.load.image('fly_4', 'assets/entities/player/fly/fly_5.png');
    this.load.image('fly_5', 'assets/entities/player/fly/fly_6.png');

    this.load.image('hurt', 'assets/entities/player/hurt/hurt_1.png')

    this.load.image('death_1', 'assets/entities/player/death/death_1.png');
    this.load.image('death_2', 'assets/entities/player/death/death_2.png');
    this.load.image('death_3', 'assets/entities/player/death/death_3.png');
    this.load.image('death_4', 'assets/entities/player/death/death_4.png');
    this.load.image('death_4', 'assets/entities/player/death/death_5.png');
    this.load.image('death_5', 'assets/entities/player/death/death_6.png');
}

function create() {
    createPlayer.call(this); // Usamos .call(this) para mantener el contexto de Phaser
    createPlanet.call(this);
    createBlackHole.call(this);
    addScore.call(this);
}

// --- Funciones de Creación ---

function createPlayer() {
    player = this.add.image(400, 300, 'player');
    player.setScale(1.0);
    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'volar',
        frames:[
            {key: 'fly_1', },
            {key: 'fly_2', },
            {key: 'fly_3', },
            {key: 'fly_4', },
            {key: 'fly_5', },
            {key: 'fly_6', }
        ],
        frameRate: 6, repeat: -1
    })

    this.anims.create({
        key: 'morir',
        frames:[
            {key: 'death_1', },
            {key: 'death_2', },
            {key: 'death_3', },
            {key: 'death_4', },
            {key: 'death_5', },
            {key: 'death_6', }
        ],
        frameRate: 5, repeat: 0
    })
    

}

function createPlanet() {
    for (let i = 0; i < 5; i++) {
        let planet = this.add.image(
            Phaser.Math.Between(50, 750),
            Phaser.Math.Between(50, 550),
            'planet'
        );
        planet.setScale(1.0);
        setPlanetMovement(planet); // Configuramos sus velocidades iniciales
        planets.push(planet);
    }
}

function setPlanetMovement(planet) {
    planet.vx = Phaser.Math.Between(-2, 2); // Cambiado de xy a vx
    planet.vy = Phaser.Math.Between(-2, 2);
}

function createBlackHole() {
    for (let i = 0; i < 3; i++) {
        let blackHole = this.add.image(
            Phaser.Math.Between(50, 750),
            Phaser.Math.Between(50, 550),
            'blackHole'
        );
        blackHole.setScale(1.0);
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
    vidaText = this.add.text(10, 40, 'Vida: 3', { fontSize: '20px', fill: '#ffffff' });
}

// --- Función Update ---

function update() {
    playerIsPlaying();
    stopPlayerOutOfBounds();   // Mantiene al jugador en pantalla
    planetMovement();          // Movimiento de planetas
    blackHoleMovement();       // Movimiento de agujeros negros (corregido el nombre)
    catchPlanet();             // Colisiones planetas
    catchBlackHole();          // Colisiones agujeros negros
}

// --- Lógica de Movimiento y Eventos ---

function playerIsPlaying(){
    let playerIsAlive=true;
    if(vida>0) {
        playerIsAlive=false;
    } else {}
    
    if (playerIsAlive==true){
        playerMovement();
    } else {
        playerLose();
    }
}


function playerMovement() {
    let enMovimiento=false;

    if (cursors.left.isDown) {
        player.x -= 3;
        player.flipX = true;
        enMovimiento = true;
    } else if (cursors.right.isDown) {
        player.x += 3;
        player.flipX = false;
        enMovimiento = false;
    }

    if (cursors.up.isDown) {
        player.y -= 3;
        enMovimiento = true;
    } else if (cursors.down.isDown) {
        player.y += 3;
        enMovimiento = true;
    }

    if (enMovimiento==true) {
        player.play('volar', true);
    } else {
        player.play('volar', true);
    }
}

function playerLose(){
    textoPerder = this.add.text(20, 20, 'HAS PERDIDO', { fontSize: '20px', fill: '#ff0000' });
    player.play('morir', true);
}

function stopPlayerOutOfBounds() {
    player.x = Phaser.Math.Clamp(player.x, 20, 780);
    player.y = Phaser.Math.Clamp(player.y, 20, 580);
}

function planetMovement() {
    planets.forEach(planet => {
        planet.x += planet.vx;
        planet.y += planet.vy; // Corregido de ghost.vy a planet.vy

        if (Math.random() < 0.02) {
            planet.vx = Phaser.Math.Between(-2, 2);
            planet.vy = Phaser.Math.Between(-2, 2);
        }

        planet.x = Phaser.Math.Clamp(planet.x, 20, 780);
        planet.y = Phaser.Math.Clamp(planet.y, 20, 580);
    });
}

function blackHoleMovement() {
    blackHoles.forEach(blackHole => {
        blackHole.x += blackHole.vx;
        blackHole.y += blackHole.vy;

        if (Math.random() < 0.02) {
            blackHole.vx = Phaser.Math.Between(-2, 2);
            blackHole.vy = Phaser.Math.Between(-2, 2);
        }

        blackHole.x = Phaser.Math.Clamp(blackHole.x, 20, 780);
        blackHole.y = Phaser.Math.Clamp(blackHole.y, 20, 580);
    });
}

function catchPlanet() {
    planets.forEach(planet => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), planet.getBounds())) {
            score++;
            scoreText.setText('Puntos: ' + score);
            planet.setTint(0x00ffff);
            
            // Reposicionar planeta
            planet.x = Phaser.Math.Between(50, 750);
            planet.y = Phaser.Math.Between(50, 550);

            setTimeout(() => { planet.clearTint(); }, 200);
        }
    });
}

function catchBlackHole() {
    blackHoles.forEach(blackHole => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), blackHole.getBounds())) {
            score--;
            vida--;
            scoreText.setText('Puntos: ' + score);
            vidaText.setText('Vida: ' + vida);

            player.setTint(0x00ffff); // Tinte rojo para daño

            // Reposicionar jugador (penalización)
            player.x = 400;
            player.y = 300;

            setTimeout(() => {
                player.clearTint();
                player.play(hurt, true);
            }, 200);
        }
    });
}