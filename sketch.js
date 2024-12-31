let sprites = {
  player1: {
    run: {
      img: null,
      width: 108,
      height: 95,
      frames: 6
    },
    wave: {
      img: null,
      width: 104,
      height: 94,
      frames: 9
    }
  },
  player2: {
    stand: {
      img: null,
      width: 84,
      height: 80,
      frames: 7
    },
    hit: {
      img: null,
      width: 83,
      height: 94,
      frames: 9
    }
  },
  background: {
    img: null
  },
  explosion: {
    img: null,
    width: 66,
    height:58 ,
    frames: 8
  }
};

let player1, player2;
let player1State = 'run';
let player2State = 'stand';

function preload() {
  // 載入精靈圖
  sprites.player1.run.img = loadImage('play1/run/run.png');
  sprites.player1.wave.img = loadImage('play1/wave/wave.png');
  sprites.player2.stand.img = loadImage('play2/stand/stand.png');
  sprites.player2.hit.img = loadImage('play2/hit/hit.png');
  sprites.background.img = loadImage('background.png');
  sprites.explosion.img = loadImage('explosion.png');  // 爆炸精靈圖
}

function setup() {
  createCanvas(800, 400);
  
  player1 = {
    x: 100,
    y: height - 100,
    currentFrame: 0,
    frameDelay: 5,
    frameCount: 0,
    health: 100,
    bullets: [],
    speed: 5,
    direction: 1
  };
  
  player2 = {
    x: width - 200,
    y: height - 100,
    currentFrame: 0,
    frameDelay: 5,
    frameCount: 0,
    health: 100,
    bullets: [],
    speed: 5,
    direction: -1
  };
}

function draw() {
  // 保留灰色背景
  background(220);
  
  // 繪製背景圖片
  image(sprites.background.img, 0, 0, width, height);
  
  // 加入文字 "TKUET"
  textSize(80);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  fill(255);
  stroke("#582f0e");
  strokeWeight(25);
  text("TKUET", width/2, 30);
  
  // 處理玩家移動
  handlePlayerMovement();
  
  // 更新玩家
  updateAndDrawCharacter(player1, player1.x, sprites.player1, player1State, false);
  updateAndDrawCharacter(player2, player2.x, sprites.player2, player2State, false);
  
  // 更新和繪製子彈
  updateAndDrawBullets(player1);
  updateAndDrawBullets(player2);
  
  // 繪製生命值
  drawHealth();
}
function handlePlayerMovement() {
  // 玩家1控制 (WASD)
  if (keyIsDown(87)) { // W
    player1.y = max(50, player1.y - player1.speed);
  }
  if (keyIsDown(83)) { // S
    player1.y = min(height - 100, player1.y + player1.speed);
  }
  if (keyIsDown(65)) { // A
    player1.x = max(0, player1.x - player1.speed);
    player1State = 'wave';
    player1.direction = -1;
  }
  if (keyIsDown(68)) { // D
    player1.x = min(width - 100, player1.x + player1.speed);
    player1State = 'wave';
    player1.direction = 1;
  }
  
  // 玩家2控制 (方向鍵)
  if (keyIsDown(UP_ARROW)) {
    player2.y = max(50, player2.y - player2.speed);
  }
  if (keyIsDown(DOWN_ARROW)) {
    player2.y = min(height - 100, player2.y + player2.speed);
  }
  if (keyIsDown(LEFT_ARROW)) {
    player2.x = max(0, player2.x - player2.speed);
    player2State = 'hit';
    player2.direction = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player2.x = min(width - 100, player2.x + player2.speed);
    player2State = 'hit';
    player2.direction = 1;
  }
  
  // 如果沒有按移動鍵，回到預設動作
  if (!keyIsDown(65) && !keyIsDown(68)) {
    player1State = 'run';
  }
  if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
    player2State = 'stand';
  }
}

function updateAndDrawCharacter(player, x, spriteData, state, flipX) {
  let sprite = spriteData[state];
  
  // 更新動畫幀
  player.frameCount++;
  if(player.frameCount >= player.frameDelay) {
    player.frameCount = 0;
    player.currentFrame = (player.currentFrame + 1) % sprite.frames;
  }
  
  push();
  if(player.direction === -1) {
    translate(x + sprite.width, player.y);
    scale(-1, 1);
  } else {
    translate(x, player.y);
  }
  
  // 繪製當前幀
  let frameX = player.currentFrame * sprite.width;
  image(sprite.img, 
        0, 0,
        sprite.width, sprite.height,
        frameX, 0,
        sprite.width, sprite.height);
  pop();
}

function drawHealth() {
  let barWidth = 200;    // 生命條寬度
  let barHeight = 25;    // 生命條高度
  let margin = 20;       // 邊距
  let cornerRadius = 5;  // 圓角半徑
  
  // 玩家1生命值 (左側)
  push();
  // 陰影效果
  noStroke();
  fill(0, 0, 0, 50);
  rect(margin + 2, margin + 2, barWidth, barHeight, cornerRadius);
  
  // 外框
  stroke(40);
  strokeWeight(2);
  fill(60);
  rect(margin, margin, barWidth, barHeight, cornerRadius);
  
  // 生命值條
  noStroke();
  let health1Width = map(player1.health, 0, 100, 0, barWidth - 4);
  let healthColor1 = color(255, 0, 0);
  let gradientColor1 = color(200, 0, 0);
  drawHealthGradient(margin + 2, margin + 2, health1Width, barHeight - 4, healthColor1, gradientColor1, cornerRadius);
  
  // 生命值數字
  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(16);
  text(`P1: ${player1.health}`, margin + 10, margin + barHeight/2);
  pop();
  
  // 玩家2生命值 (右側)
  push();
  // 陰影效果
  noStroke();
  fill(0, 0, 0, 50);
  rect(width - margin - barWidth + 2, margin + 2, barWidth, barHeight, cornerRadius);
  
  // 外框
  stroke(40);
  strokeWeight(2);
  fill(60);
  rect(width - margin - barWidth, margin, barWidth, barHeight, cornerRadius);
  
  // 生命值條
  noStroke();
  let health2Width = map(player2.health, 0, 100, 0, barWidth - 4);
  let healthColor2 = color(0, 70, 255);
  let gradientColor2 = color(0, 50, 200);
  drawHealthGradient(width - margin - health2Width - 2, margin + 2, health2Width, barHeight - 4, healthColor2, gradientColor2, cornerRadius);
  
  // 生命值數字
  fill(255);
  noStroke();
  textAlign(RIGHT, CENTER);
  textStyle(BOLD);
  textSize(16);
  text(`P2: ${player2.health}`, width - margin - 10, margin + barHeight/2);
  pop();
}

function drawHealthGradient(x, y, w, h, c1, c2, radius) {
  for(let i = 0; i < h; i++) {
    let inter = map(i, 0, h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    fill(c);
    rect(x, y + i, w, 1, radius);
  }
}

function shoot(player) {
  let playerWidth = sprites[player === player1 ? 'player1' : 'player2'][player === player1 ? 'run' : 'stand'].width;
  
  let bullet = {
    x: player === player1 ? player1.x + playerWidth : player2.x,
    y: player.y + playerWidth/2,
    speed: 10 * player.direction,
    isExploding: false,
    currentFrame: 0,
    explosionFrame: 0
  };
  
  player.bullets.push(bullet);
}

function updateAndDrawBullets(player) {
  for (let i = player.bullets.length - 1; i >= 0; i--) {
    let bullet = player.bullets[i];
    
    if (bullet.isExploding) {
      // 繪製爆炸動畫
      let frameX = bullet.explosionFrame * sprites.explosion.width;
      image(sprites.explosion.img,
            bullet.x - sprites.explosion.width/2,
            bullet.y - sprites.explosion.height/2,
            sprites.explosion.width,
            sprites.explosion.height,
            frameX, 0,
            sprites.explosion.width,
            sprites.explosion.height);
      
      // 更新爆炸幀
      bullet.explosionFrame++;
      
      // 爆炸動畫結束後移除子彈
      if (bullet.explosionFrame >= sprites.explosion.frames) {
        player.bullets.splice(i, 1);
      }
      continue;
    }
    
    // 更新子彈位置
    bullet.x += bullet.speed;
    
    // 繪製子彈
    fill(player === player1 ? 'red' : 'blue');
    noStroke();
    circle(bullet.x, bullet.y, 10);
    
    // 檢查碰撞
    let otherPlayer = player === player1 ? player2 : player1;
    if (checkBulletCollision(bullet, otherPlayer)) {
      otherPlayer.health = max(0, otherPlayer.health - 10);
      // 觸發爆炸效果
      bullet.isExploding = true;
      bullet.explosionFrame = 0;
      continue;
    }
    
    // 移除超出畫面的子彈
    if (bullet.x < 0 || bullet.x > width) {
      player.bullets.splice(i, 1);
    }
  }
}

function checkBulletCollision(bullet, player) {
  let playerWidth = 80;
  let playerHeight = 80;
  return bullet.x > player.x && 
         bullet.x < player.x + playerWidth && 
         bullet.y > player.y && 
         bullet.y < player.y + playerHeight;
}

function keyPressed() {
  if (keyCode === 70) shoot(player1);  // F鍵發射
  if (keyCode === 32) shoot(player2);  // 空白鍵發射
}
