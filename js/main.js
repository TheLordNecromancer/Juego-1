//Juego caza planetas

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

// Instanciación del juego
const game = new Phaser.Game(config);

//Variables

//  Jugador
let player;
let cursors;

//  Entidades
let ghosts = [];
let blackHoles = [];

//Variables del juego

//  Puntuación
let score = 0;
let scoreText;

//  Vida

let vida = 3;




function preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('ghost', 'https://labs.phaser.io/assets/sprites/ghost.png');
}

function create() {
    // Jugador
    player = this.add.image(400, 300, 'player');
    player.setScale(0.8);

    // Controles
    cursors = this.input.keyboard.createCursorKeys();

    // Crear fantasmas
    for (let i = 0; i < 5; i++) {
        let ghost = this.add.image(
            Phaser.Math.Between(50, 750),
            Phaser.Math.Between(50, 550),
            'ghost'
        );
        ghost.setScale(0.2);

        // velocidad aleatoria inicial
        ghost.vx = Phaser.Math.Between(-2, 2);
        ghost.vy = Phaser.Math.Between(-2, 2);

        ghosts.push(ghost);
    }

    // Puntuación
    scoreText = this.add.text(10, 10, 'Puntos: 0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
}

function update() {
    // Movimiento del jugador
    if (cursors.left.isDown) {
        player.x -= 3;
    } else if (cursors.right.isDown) {
        player.x += 3;
    }

    if (cursors.up.isDown) {
        player.y -= 3;
    } else if (cursors.down.isDown) {
        player.y += 3;
    }

    player.x = Phaser.Math.Clamp(player.x, 20, 780);
    player.y = Phaser.Math.Clamp(player.y, 20, 580);

    // Movimiento aleatorio constante de fantasmas
    ghosts.forEach(ghost => {
        ghost.x += ghost.vx;
        ghost.y += ghost.vy;

        // Cambiar dirección aleatoriamente
        if (Math.random() < 0.02) {
            ghost.vx = Phaser.Math.Between(-2, 2);
            ghost.vy = Phaser.Math.Between(-2, 2);
        }

        // Evitar que salgan de la pantalla
        ghost.x = Phaser.Math.Clamp(ghost.x, 20, 780);
        ghost.y = Phaser.Math.Clamp(ghost.y, 20, 580);
    });

    // Colisiones
    ghosts.forEach(ghost => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
            player.getBounds(),
            ghost.getBounds()
        )) {
            // sumar puntos
            score++;
            scoreText.setText('Puntos: ' + score);

            // efecto visual
            ghost.setTint(0x00ffff);

            // reposicionar fantasma
            ghost.x = Phaser.Math.Between(50, 750);
            ghost.y = Phaser.Math.Between(50, 550);

            // quitar efecto
            setTimeout(() => {
                ghost.clearTint();
            }, 200);
        }
    });
}