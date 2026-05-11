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
      titre: 'Stage à ProActive Swiss',
      description: '2eme place à l’académie des jeunes developpeurs Fullstack',
      annee: 'Mai 2026 à Aujourd’hui'
    },
    {
      titre: 'BootCamp à ProActive Swiss et Growing Consulting',
      description: '2eme place à l’académie des jeunes developpeurs Fullstack',
      annee: 'Avril 2026'
    },
    {
      titre: 'Stage à NEURA COMPUTING',
      description: 'Développeur fullstack',
      annee: 'Juin à Août 2025'
    },    
    {
      titre: 'CONCOURS ET CHALLENGE TECH',
      description: '2ème Place au YADAC ROBOTICS CHALLENGE',
      annee: 'Décembre 2024'
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