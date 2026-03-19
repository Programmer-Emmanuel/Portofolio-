// projets.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';
import { image } from '../../constants/image';

interface Projet {
  id: number;
  titre: string;
  image_couverture: string;
  autres_images: string[];
  lien: string | null;
  description: string;
}

@Component({
  selector: 'app-projets',
  imports: [CommonModule],
  templateUrl: './projets.html',
  styleUrl: './projets.css',
})

export class Projets implements OnInit {
  image=image

  projets: Projet[] = [
    {
      id: 1,
      titre: 'Ebamage',
      image_couverture: image.ebamage.couverture,
      autres_images: [
        image.ebamage.image1,
        image.ebamage.image2,
        image.ebamage.image3,
      ],
      lien: '',
      description: 'Application mobile e-commerce complète avec panier, suivi des commandes et interface interactive.',
    },
    {
      id: 2,
      titre: 'Skanfy',
      image_couverture: image.skanfy.couverture,
      autres_images: [
        image.skanfy.image1,
        image.skanfy.image2,
        image.skanfy.image3,
        image.skanfy.image4,
      ],
      lien: 'https://skanfy.com',
      description: 'Application web de recupération des objets perdus développement de la génération dynamique de codes QR personnalisés, associés à chaque objet, avec mise en place du système de signalement après scan.',
    },
    {
      id: 3,
      titre: 'Africa Medical Appointment',
      image_couverture: image.ama.couverture,
      autres_images: [
        image.ama.image1
      ],
      lien: '',
      description: 'Application web international de prise de rendez-vous médicaux.',
    },
    {
      id: 4,
      titre: 'TropDouxRecup',
      image_couverture: image.tdr.couverture,
      autres_images: [
        image.tdr.image1,
        image.tdr.image2,
        image.tdr.image3,
        image.tdr.image4,
        image.tdr.image5,
      ],
      lien: '',
      description: 'Application web/mobile de lutte contre le gaspillage alimentaire, connectant restaurants et clients pour la vente d’invendus à prix réduit.',
    },
    {
      id: 5,
      titre: 'TransfertExpress',
      image_couverture: image.transfertExpress.couverture,
      autres_images: [
        image.transfertExpress.image1,
        image.transfertExpress.image2,
        image.transfertExpress.image3,
        image.transfertExpress.image4,
        image.transfertExpress.image5,
      ],
      lien: '',
      description: 'application web simulant le transfert d’argent d’une personne X à une personne Y de manière fluide.',
    },
    {
      id: 6,
      titre: 'EM-Manager',
      image_couverture: image.emManager.couverture,
      autres_images: [
        image.emManager.image1,
        image.emManager.image2,
        image.emManager.image3,
        image.emManager.image4,
        image.emManager.image5,
        image.emManager.image6,
        image.emManager.image7,
        image.emManager.image8,
        image.emManager.image9,
        image.emManager.image10,
        image.emManager.image11,
        image.emManager.image12,
        image.emManager.image13,
        image.emManager.image14,
        image.emManager.image15,
        image.emManager.image16,
        image.emManager.image17,
      ],
      lien: '',
      description: 'e application web complète développée avec Laravel qui centralise la gestion des ressources humaines, des employés, des congés, des finances et de la communication interne grâce à un tableau de bord interactif, des workflows automatisés et des fonctionnalités intelligentes basées sur l’IA',
    }
  ];

  selectedProjet: Projet | null = null;
  isModalOpen = false;
  currentImageIndex = 0;
  autoSlideInterval: any;

  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-in-out'
    });
  }

  openModal(projet: Projet) {
    this.selectedProjet = projet;
    this.currentImageIndex = 0;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Empêcher le scroll
    this.startAutoSlide();
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProjet = null;
    document.body.style.overflow = 'auto'; // Restaurer le scroll
    this.stopAutoSlide();
  }

  nextImage() {
    if (this.selectedProjet) {
      const totalImages = this.selectedProjet.autres_images.length + 1; // +1 pour l'image de couverture
      this.currentImageIndex = (this.currentImageIndex + 1) % totalImages;
    }
  }

  prevImage() {
    if (this.selectedProjet) {
      const totalImages = this.selectedProjet.autres_images.length + 1;
      this.currentImageIndex = (this.currentImageIndex - 1 + totalImages) % totalImages;
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 3000); // Change toutes les 3 secondes
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  getCurrentImage(): string {
    if (!this.selectedProjet) return '';
    if (this.currentImageIndex === 0) {
      return this.selectedProjet.image_couverture;
    } else {
      return this.selectedProjet.autres_images[this.currentImageIndex - 1];
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onLeftArrow() {
    if (this.isModalOpen) {
      this.prevImage();
    }
  }

  @HostListener('document:keydown.arrowright')
  onRightArrow() {
    if (this.isModalOpen) {
      this.nextImage();
    }
  }
}