// experiences.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';

@Component({
  selector: 'app-experiences',
  imports: [CommonModule],
  templateUrl: './experiences.html',
  styleUrl: './experiences.css',
})
export class Experiences implements OnInit {

  experiences = [
    {
      titre: 'Stage à NEURA COMPUTING',
      description: 'Développeur fullstack',
      annee: '2025'
    },    
    {
      titre: 'CONCOURS ET CHALLENGE TECH',
      description: '2ème Place au YADAC ROBOTICS CHALLENGE',
      annee: '2024'
    },
  ];

  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-in-out'
    });
  }
}