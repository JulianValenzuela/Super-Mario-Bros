import { createAnimations } from "./animations.js";

/* Phaser global*/
const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    gravity: { y: 300 },
  },
  scene: {
    preload, // se ejecuta para cargar los recursos
    create, // se ejecuta cuando el juego comienza
    update, // se ejecuta en cada frame
  },
};

new Phaser.Game(config);
// this se refiere a todo lo de nuestro juego que estamos contruyendo... variables, configuraciones, metodos, recursos...

function preload() {
  this.load.image(
    "cloud1", // esta es la id
    "assets/scenery/overworld/cloud1.png"
  );
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });
  this.load.audio("gameover", "assets/sound/music/gameover.mp3");
  this.load.audio("jump", "assets/sound/effects/jump.mp3");
}

function create() {
  // image(x, y, id-del-asset)
  this.add.image(100, 50, "cloud1").setOrigin(0, 0).setScale(0.15);

  this.add.image(240, 90, "cloud1").setOrigin(0, 0).setScale(0.15);

  this.add.image(320, 20, "cloud1").setOrigin(0, 0).setScale(0.15);
  this.floor = this.physics.add.staticGroup(); // estamos creando el suelo en un grupo estático

  this.floor
    .create(0, config.height - 32, "floorbricks")
    .setOrigin(0, 0)
    .refreshBody(); // esto es para que nuestro personaje se queda en el suelo

  this.floor
    .create(155, config.height - 32, "floorbricks")
    .setOrigin(0, 0)
    .refreshBody();
  this.floor
    .create(283, config.height - 32, "floorbricks")
    .setOrigin(0, 0)
    .refreshBody();

  this.mario = this.physics.add
    .sprite(50, 100, "mario") // esta es la parte del juego que da gravedad
    .setOrigin(0, 1)
    .setCollideWorldBounds(true) // se crea el colision del personaje con el limite de los lados
    .setGravityY(500);

  this.physics.world.setBounds(0, 0, 2000, config.height); // se crea el limite de la zona de juego
  this.physics.add.collider(this.mario, this.floor); // Aqui estamos creando la colicion del personaje con el suelo

  this.cameras.main.setBounds(0, 0, 2000, config.height); // se crea el limite de la camara
  this.cameras.main.startFollow(this.mario); // se crea el camara que sigue al personaje

  createAnimations(this); // se cargan las animaciones importadas

  this.keys = this.input.keyboard.createCursorKeys(); // este es el metodo que lee las teclas para el update
}

function update() {
  if (this.mario.isDead) {
    this.cameras.main.stopFollow();
    return;
  }
  if (this.keys.left.isDown) {
    this.mario.anims.play("mario-walk", true);
    this.mario.x -= 2;
    this.mario.flipX = true; // con esto giramos el personaje
  } else if (this.keys.right.isDown) {
    this.mario.anims.play("mario-walk", true);
    this.mario.x += 2;
    this.mario.flipX = false;
  } else {
    this.mario.anims.play("mario-idle", true); // nos aseguramos de que mario se quede en el primer frama cuando se detiene
  }
  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300);
    this.mario.anims.play("mario-jump", true);
    this.sound.add("jump", { volume: 0.5 }).play();
  }
  if (this.mario.y >= config.height) {
    this.mario.isDead = true;
    this.mario.anims.play("mario-dead", true);
    this.mario.setCollideWorldBounds(false); // se elimina la colision  al juego del personaje con el limite de los lados para dar fin
    this.sound.add("gameover", { volume: 0.5 }).play(); // se reproducira el sonido de gameover
    setTimeout(() => {
      this.mario.setVelocityY(-350);
    }, 100); // estamos creando la animacion de la muerte del personaje

    setTimeout(() => {
      this.scene.restart();
    }, 7000); // se esta inicinando el juego de nuevo
  }
}
