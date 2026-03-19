// competences.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';
import { image } from '../../constants/image';

interface Competence {
  id: number;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-competences',
  imports: [CommonModule],
  templateUrl: './competences.html',
  styleUrl: './competences.css',
})
export class Competences implements OnInit {

  image=image;
  
  competences: Competence[] = [
  {
    id: 1,
    icon: image.devFront,
    title: 'Développement Frontend',
    description: 'Création d’interfaces utilisateur modernes, réactives et responsives avec une attention particulière au design et à l’expérience utilisateur.'
  },
  {
    id: 2,
    icon: image.devBackend,
    title: 'Développement Backend',
    description: 'Conception de systèmes robustes et évolutifs, gestion de la logique métier, des bases de données et sécurisation des applications.'
  },
  {
    id: 3,
    icon: image.devMobile,
    title: 'Développement Mobile',
    description: 'Création d’applications mobiles performantes offrant une expérience fluide et adaptée aux différents types d’appareils.'
  },
  {
    id: 4,
    icon: image.api,
    title: 'Conception d\'API',
    description: 'Mise en place d’APIs structurées, sécurisées et optimisées pour assurer une communication efficace entre les services.'
  },
  {
    id: 7,
    icon: image.uiUx,
    title: 'UI/UX Design',
    description: 'Conception d’interfaces intuitives et centrées sur l’utilisateur, avec une attention portée à l’ergonomie et à l’accessibilité.'
  },
  {
    id: 8,
    icon: image.optimisation,
    title: 'Optimisation & Performance',
    description: 'Amélioration des performances pour garantir des applications rapides, fluides et une excellente expérience utilisateur.'
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