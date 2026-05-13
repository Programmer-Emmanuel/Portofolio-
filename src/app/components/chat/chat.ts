// chat.component.ts
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
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
  
  score: number = 0;
  highScore: number = 0;
  level: number = 1;
  gameActive: boolean = false;
  gameStarted: boolean = false;
  
  playerPosition: number = 50; // Position X du joueur en pourcentage (0-100)
  obstacles: Obstacle[] = [];
  explosion: { x: number, y: number } | null = null;
  
  private gameLoop: any;
  private obstacleSpawnInterval: any;
  private difficultyInterval: any;
  private scoreInterval: any;
  
  private readonly PLAYER_WIDTH = 48;
  private readonly PLAYER_HEIGHT = 48;
  private readonly PLAYER_BOTTOM_OFFSET = 30;
  private readonly CANVAS_HEIGHT = 450; // Réduit de 500 à 450
  
  private baseObstacleSpeed: number = 3;
  private currentObstacleSpeed: number = 3;
  private spawnRate: number = 2000; // milliseconds
  
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
  
  moveLeft() {
    if (!this.gameActive) return;
    // Déplacer de 8% à gauche, minimum 5%
    this.playerPosition = Math.max(5, this.playerPosition - 8);
    this.cdr.detectChanges();
  }
  
  moveRight() {
    if (!this.gameActive) return;
    // Déplacer de 8% à droite, maximum 95%
    this.playerPosition = Math.min(95, this.playerPosition + 8);
    this.cdr.detectChanges();
  }
  
  startGame() {
    this.stopGame();
    this.resetGameState();
    this.gameActive = true;
    this.gameStarted = true;
    
    // Forcer la détection des changements
    this.cdr.detectChanges();
    
    // Démarrer la boucle de jeu
    this.gameLoop = setInterval(() => {
      if (this.gameActive) {
        this.updateGame();
        this.cdr.detectChanges();
      }
    }, 16); // ~60 FPS
    
    // Générer des obstacles périodiquement
    this.obstacleSpawnInterval = setInterval(() => {
      if (this.gameActive) {
        this.spawnObstacle();
        this.cdr.detectChanges();
      }
    }, this.spawnRate);
    
    // Mettre à jour le score périodiquement
    this.scoreInterval = setInterval(() => {
      if (this.gameActive) {
        this.updateScore();
        this.cdr.detectChanges();
      }
    }, 1000);
    
    // Gérer la difficulté progressive
    this.difficultyInterval = setInterval(() => {
      if (this.gameActive) {
        this.increaseDifficulty();
        this.cdr.detectChanges();
      }
    }, 15000); // Toutes les 15 secondes
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
    
    // Redémarrer automatiquement après reset
    setTimeout(() => {
      this.startGame();
    }, 100);
  }
  
  spawnObstacle() {
    if (!this.gameActive) return;
    
    const obstacleWidth = 40;
    const obstacleHeight = 40;
    // Position X en pourcentage (5% à 95%)
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
    // Mettre à jour les positions des obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      obstacle.y += obstacle.speed;
      
      // Supprimer les obstacles qui sont sortis de l'écran
      if (obstacle.y > this.CANVAS_HEIGHT) {
        this.obstacles.splice(i, 1);
        i--;
        continue;
      }
      
      // Vérifier la collision avec le joueur
      if (this.checkCollision(obstacle)) {
        this.endGame();
        return;
      }
    }
    this.cdr.detectChanges();
  }
  
  checkCollision(obstacle: Obstacle): boolean {
    // Convertir la position du joueur de pourcentage à pixels
    const containerWidth = 500; // Largeur du canvas en pixels
    const playerXInPixels = (this.playerPosition / 100) * containerWidth;
    
    // Position du joueur en pixels
    const playerLeft = playerXInPixels - this.PLAYER_WIDTH / 2;
    const playerRight = playerXInPixels + this.PLAYER_WIDTH / 2;
    const playerTop = this.CANVAS_HEIGHT - this.PLAYER_HEIGHT - this.PLAYER_BOTTOM_OFFSET;
    const playerBottom = this.CANVAS_HEIGHT - this.PLAYER_BOTTOM_OFFSET;
    
    // Position de l'obstacle (convertir X de pourcentage à pixels)
    const obstacleXInPixels = (obstacle.x / 100) * containerWidth;
    const obstacleLeft = obstacleXInPixels - obstacle.width / 2;
    const obstacleRight = obstacleXInPixels + obstacle.width / 2;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + obstacle.height;
    
    // Vérifier l'intersection
    const collision = (playerLeft < obstacleRight &&
                       playerRight > obstacleLeft &&
                       playerTop < obstacleBottom &&
                       playerBottom > obstacleTop);
    
    return collision;
  }
  
  updateScore() {
    if (!this.gameActive) return;
    
    // Le score augmente en fonction du temps de survie
    this.score++;
    
    // Mettre à jour le high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('trafficDodgerHighScore', this.highScore.toString());
    }
    
    this.cdr.detectChanges();
  }
  
  increaseDifficulty() {
    if (!this.gameActive) return;
    
    // Augmenter le niveau
    this.level++;
    
    // Augmenter la vitesse des obstacles
    this.currentObstacleSpeed = Math.min(this.baseObstacleSpeed + (this.level - 1) * 0.5, 12);
    
    // Augmenter le taux d'apparition (plus fréquent)
    if (this.spawnRate > 500) {
      this.spawnRate = Math.max(500, this.spawnRate - 150);
      
      // Recréer l'intervalle avec le nouveau taux
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
    
    // Mettre à jour la vitesse des obstacles existants
    for (let obstacle of this.obstacles) {
      obstacle.speed = this.currentObstacleSpeed;
    }
    
    this.cdr.detectChanges();
  }
  
  endGame() {
    this.gameActive = false;
    
    // Afficher l'explosion à la position du joueur
    this.explosion = {
      x: this.playerPosition,
      y: this.CANVAS_HEIGHT - this.PLAYER_HEIGHT - this.PLAYER_BOTTOM_OFFSET + this.PLAYER_HEIGHT / 2
    };
    
    this.cdr.detectChanges();
    
    // Cacher l'explosion après l'animation
    setTimeout(() => {
      this.explosion = null;
      this.cdr.detectChanges();
    }, 300);
    
    this.stopGame();
  }
}