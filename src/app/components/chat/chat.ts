// chat.component.ts
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Nav } from '../../components/nav/nav';
import * as AOS from 'aos';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, Nav],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export default class Chat implements OnInit, OnDestroy {
  
  @ViewChild('gameCanvas') gameCanvas!: ElementRef;
  
  score: number = 0;
  highScore: number = 0;
  level: number = 1;
  gameActive: boolean = false;
  gameStarted: boolean = false;
  
  playerPosition: number = 50; // Position X du joueur en pourcentage (0-100)
  obstacles: Obstacle[] = [];
  explosion: { x: number, y: number } | null = null;
  isTouching: boolean = false;
  
  private gameLoop: any;
  private obstacleSpawnInterval: any;
  private difficultyInterval: any;
  private scoreInterval: any;
  
  private readonly PLAYER_WIDTH = 48;
  private readonly PLAYER_HEIGHT = 48;
  private readonly PLAYER_BOTTOM_OFFSET = 30;
  private readonly CANVAS_HEIGHT = 450;
  private readonly CANVAS_WIDTH = 500;
  
  private baseObstacleSpeed: number = 3;
  private currentObstacleSpeed: number = 3;
  private spawnRate: number = 2000;
  
  // Variables pour le contrôle tactile
  private isDragging: boolean = false;
  private touchStartX: number = 0;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-in-out'
    });
    
    // Charger le high score depuis localStorage
    const savedHighScore = localStorage.getItem('trafficDodgerHighScore');
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore);
    }
    
    // Initialiser la position du joueur au centre (50%)
    this.playerPosition = 50;
    
    // Démarrer le jeu automatiquement
    setTimeout(() => {
      this.startGame();
    }, 100);
  }
  
  ngOnDestroy() {
    this.stopGame();
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.gameActive) return;
    
    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.moveLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.moveRight();
        break;
    }
  }
  
  // Contrôle tactile - Touch events
  onTouchStart(event: TouchEvent) {
    if (!this.gameActive) return;
    event.preventDefault();
    this.isDragging = true;
    this.isTouching = true;
    this.touchStartX = event.touches[0].clientX;
    
    // Cacher l'indicateur après 2 secondes
    setTimeout(() => {
      this.isTouching = false;
      this.cdr.detectChanges();
    }, 2000);
  }
  
  onTouchMove(event: TouchEvent) {
    if (!this.gameActive || !this.isDragging) return;
    event.preventDefault();
    
    const touchX = event.touches[0].clientX;
    const canvasRect = this.gameCanvas.nativeElement.getBoundingClientRect();
    const relativeX = touchX - canvasRect.left;
    const percentage = (relativeX / canvasRect.width) * 100;
    
    // Limiter entre 5% et 95%
    let newPosition = Math.min(95, Math.max(5, percentage));
    this.playerPosition = newPosition;
    this.cdr.detectChanges();
  }
  
  onTouchEnd() {
    this.isDragging = false;
  }
  
  // Contrôle tactile - Mouse events (pour le debugging sur desktop)
  onMouseDown(event: MouseEvent) {
    if (!this.gameActive) return;
    event.preventDefault();
    this.isDragging = true;
    this.updateCarPositionFromMouse(event);
  }
  
  onMouseMove(event: MouseEvent) {
    if (!this.gameActive || !this.isDragging) return;
    event.preventDefault();
    this.updateCarPositionFromMouse(event);
  }
  
  onMouseUp() {
    this.isDragging = false;
  }
  
  private updateCarPositionFromMouse(event: MouseEvent) {
    const canvasRect = this.gameCanvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const percentage = (mouseX / canvasRect.width) * 100;
    
    // Limiter entre 5% et 95%
    let newPosition = Math.min(95, Math.max(5, percentage));
    this.playerPosition = newPosition;
    this.cdr.detectChanges();
  }
  
  moveLeft() {
    if (!this.gameActive) return;
    this.playerPosition = Math.max(5, this.playerPosition - 8);
    this.cdr.detectChanges();
  }
  
  moveRight() {
    if (!this.gameActive) return;
    this.playerPosition = Math.min(95, this.playerPosition + 8);
    this.cdr.detectChanges();
  }
  
  startGame() {
    this.stopGame();
    this.resetGameState();
    this.gameActive = true;
    this.gameStarted = true;
    
    this.cdr.detectChanges();
    
    this.gameLoop = setInterval(() => {
      if (this.gameActive) {
        this.updateGame();
        this.cdr.detectChanges();
      }
    }, 16);
    
    this.obstacleSpawnInterval = setInterval(() => {
      if (this.gameActive) {
        this.spawnObstacle();
        this.cdr.detectChanges();
      }
    }, this.spawnRate);
    
    this.scoreInterval = setInterval(() => {
      if (this.gameActive) {
        this.updateScore();
        this.cdr.detectChanges();
      }
    }, 1000);
    
    this.difficultyInterval = setInterval(() => {
      if (this.gameActive) {
        this.increaseDifficulty();
        this.cdr.detectChanges();
      }
    }, 15000);
  }
  
  resetGameState() {
    this.score = 0;
    this.level = 1;
    this.obstacles = [];
    this.playerPosition = 50;
    this.baseObstacleSpeed = 3;
    this.currentObstacleSpeed = 3;
    this.spawnRate = 2000;
    this.explosion = null;
    this.cdr.detectChanges();
  }
  
  stopGame() {
    if (this.gameLoop) clearInterval(this.gameLoop);
    if (this.obstacleSpawnInterval) clearInterval(this.obstacleSpawnInterval);
    if (this.difficultyInterval) clearInterval(this.difficultyInterval);
    if (this.scoreInterval) clearInterval(this.scoreInterval);
    
    this.gameLoop = null;
    this.obstacleSpawnInterval = null;
    this.difficultyInterval = null;
    this.scoreInterval = null;
  }
  
  resetGame() {
    if (this.gameActive) {
      this.stopGame();
    }
    this.resetGameState();
    this.gameStarted = false;
    this.gameActive = false;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.startGame();
    }, 100);
  }
  
  spawnObstacle() {
    if (!this.gameActive) return;
    
    const obstacleWidth = 40;
    const obstacleHeight = 40;
    const minX = 5;
    const maxX = 95;
    
    const obstacle: Obstacle = {
      x: Math.random() * (maxX - minX) + minX,
      y: -obstacleHeight,
      width: obstacleWidth,
      height: obstacleHeight,
      speed: this.currentObstacleSpeed
    };
    
    this.obstacles.push(obstacle);
    this.cdr.detectChanges();
  }
  
  updateGame() {
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      obstacle.y += obstacle.speed;
      
      if (obstacle.y > this.CANVAS_HEIGHT) {
        this.obstacles.splice(i, 1);
        i--;
        continue;
      }
      
      if (this.checkCollision(obstacle)) {
        this.endGame();
        return;
      }
    }
    this.cdr.detectChanges();
  }
  
  checkCollision(obstacle: Obstacle): boolean {
    const playerXInPixels = (this.playerPosition / 100) * this.CANVAS_WIDTH;
    
    const playerLeft = playerXInPixels - this.PLAYER_WIDTH / 2;
    const playerRight = playerXInPixels + this.PLAYER_WIDTH / 2;
    const playerTop = this.CANVAS_HEIGHT - this.PLAYER_HEIGHT - this.PLAYER_BOTTOM_OFFSET;
    const playerBottom = this.CANVAS_HEIGHT - this.PLAYER_BOTTOM_OFFSET;
    
    const obstacleXInPixels = (obstacle.x / 100) * this.CANVAS_WIDTH;
    const obstacleLeft = obstacleXInPixels - obstacle.width / 2;
    const obstacleRight = obstacleXInPixels + obstacle.width / 2;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + obstacle.height;
    
    return (playerLeft < obstacleRight &&
            playerRight > obstacleLeft &&
            playerTop < obstacleBottom &&
            playerBottom > obstacleTop);
  }
  
  updateScore() {
    if (!this.gameActive) return;
    
    this.score++;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('trafficDodgerHighScore', this.highScore.toString());
    }
    
    this.cdr.detectChanges();
  }
  
  increaseDifficulty() {
    if (!this.gameActive) return;
    
    this.level++;
    this.currentObstacleSpeed = Math.min(this.baseObstacleSpeed + (this.level - 1) * 0.5, 12);
    
    if (this.spawnRate > 500) {
      this.spawnRate = Math.max(500, this.spawnRate - 150);
      
      if (this.obstacleSpawnInterval) {
        clearInterval(this.obstacleSpawnInterval);
        this.obstacleSpawnInterval = setInterval(() => {
          if (this.gameActive) {
            this.spawnObstacle();
            this.cdr.detectChanges();
          }
        }, this.spawnRate);
      }
    }
    
    for (let obstacle of this.obstacles) {
      obstacle.speed = this.currentObstacleSpeed;
    }
    
    this.cdr.detectChanges();
  }
  
  endGame() {
    this.gameActive = false;
    
    this.explosion = {
      x: this.playerPosition,
      y: this.CANVAS_HEIGHT - this.PLAYER_HEIGHT - this.PLAYER_BOTTOM_OFFSET + this.PLAYER_HEIGHT / 2
    };
    
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.explosion = null;
      this.cdr.detectChanges();
    }, 300);
    
    this.stopGame();
  }
}