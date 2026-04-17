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
let planets = [];
let blackHoles = [];

//Puntajes del juego

//  Puntuación
let score = 0;
let scoreText;

//  Vida

let vida = 3;
let vidaText;

// PreCargar assets

function preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('planet', 'https://labs.phaser.io/assets/sprites/phaser-dude.png') // Para planetas
    this.load.image('blackHole', 'https://labs.phaser.io/assets/sprites/phaser-dude.png') // Para agujeros negros
    // this.load.image('fondo', 'https://labs.phaser.io/assets/sprites/phaser-dude.png') // Para el fondo del juego
}

// Crear entidades

function create() {

    createPlayer();
    
    createPlanet();

    createBlackHole();
    
    addScore();
}

function createPlayer(){
    player = this.add.image(400,300, 'player');
    player.setScale(1.0);

    cursors = this.input.keyboard.createCursorKeys();
}

function createPlanet(){
    for(let i=0; i<5; i++) {
        let planet = this.add.image(
            phaser.Math.Between(50, 750),
            phaser.Math.Between(50, 550),
            'planet'
        );
        planet.setScale(1.0);
        this.planet = setPlanetMovement(planet);
        planets.push(planet);
    }
}

function setPlanetMovement(planet){
    planet.xy = Phaser.Math.Between(-2,2);
    planet.vy = Phaser.Math.Between(-2,2);
    return planet;
}

function createBlackHole(){
    for(let i=0; i<3; i++) {
        let blackHole = this.add.image(
            Phaser.Math.Between(50, 750),
            Phaser.Math.Between(50, 550),
            'blackHole'
        );
        blackHole.setScale(1.0);
        this.blackHole = setBlackHoleMovement(blackHole);
        blackHoles.push(blackHole);
    }
}

function setBlackHoleMovement(blackHole) {
    blackHole.xy = Phaser.Math.Between(-2,2);
    blackHole.vy = Phaser.Math.Between(-2,2);
    return blackHole;
}

function addScore() {
    scoreText = this.add.text(10, 10, 'Puntos: 0', {
        fontSize: '20px',
        fill: '#ffffff'
    })
    vidaText = this.add.text(10, 20, 'Vida: 3', {
        fontSize: '20px',
        fill: '#ffffff'
    })
}

// Función Update

function update(){

    //Movimiento del jugador
    planetMovement();
    //Movimiento constante
    planetMovement();
    blackHoleMovent();

    //Eventos de juego
    catchPlanet();
    catchBlackHole();

    




}

function playerMovement(){
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
}

function stopPlayerOutOfBounds(){
    player.x = Phaser.Math.Clamp(player.x, 20, 780);
    player.y = Phaser.Math.Clamp(player.y, 20, 580);
}

function planetMovement(){
    planets.forEach(planet => {
        planet.x += planet.vx;
        planet.y += ghost.vy;

        // Cambiar dirección aleatoriamente
        if (Math.random() < 0.02) {
            planet.vx = Phaser.Math.Between(-2, 2);
            planet.vy = Phaser.Math.Between(-2, 2);
        }

        // Evitar que salgan de la pantalla
        planet.x = Phaser.Math.Clamp(planet.x, 20, 780);
        planet.y = Phaser.Math.Clamp(planet.y, 20, 580);
    });
}

function blackHoleMovent(){
    blackHoles.forEach(blackHole => {
        blackHole.x += blackHole.vx;
        blackHole.y += blackHole.vy;

        if(Math.random() < 0.02) {
            blackHole.vx = Phaser.Math.Between(-2, 2);
            blackHole.vy = Phaser.Math.Between(-2, 2);
        }

        blackHole.x = Phaser.Math.Clamp(blackHole.x, 20, 780);
        blackHole.y = Phaser.Math.Clamp(blackHole.y, 20, 580);
    })
}

function catchPlanet(){
    planets.forEach(planet => {
        if(Phaser.Geom.Intersects.RectangleToRectangle(
            player.getBounds(),
            planet.getBounds(),
        )) {

            //Sumar puntos por atrapar planeta
            score++;
            scoreText.setText('Puntos: '+ score);

            // Efecto al atrapar un planeta
            planet.setTint(0x00ffff);

            // Fin del efecto
            setTimeout(() => {
                planet.clearTint();
            }, 200)

            // Reposicionar fantasma
            planet.x = Phaser.Math.Between(50, 750);
            planet.y = Phaser.Math.Between(50, 550);


        }
    })
}

function catchBlackHole(){
    blackHoles.forEach(blackHole => {
        if(Phaser.Geom.Intersects.RectangleToRectangle(
            player.getBounds(),
            blackHole.getBounds(),
        )) {

            //Sumar puntos por atrapar planeta
            score--;
            scoreText.setText('Puntos: '+ score);
            vida--;
            vidaText.setText('Vidas: '+ vida)

            // Efecto al atrapar un planeta
            player.setTint(0x00ffff);

            // Fin del efecto
            setTimeout(() => {
                player.clearTint();
            }, 200)

            // Reposicionar fantasma
            player.x = Phaser.Math.Between(50, 750);
            player.y = Phaser.Math.Between(50, 550);
        }
    })
}




