import { Component } from '@angular/core';
import { Nav } from '../../components/nav/nav';
import { image } from '../../constants/image';
import { CommonModule } from '@angular/common';
import { fichier } from '../../constants/fichier';
import { Apropos } from '../../components/apropos/apropos';
import { Competences } from '../../components/competences/competences';
import { Projets } from '../../components/projets/projets';
import { Experiences } from '../../components/experiences/experiences';
import { Contacts } from '../../components/contacts/contacts';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-acceuil',
  imports: [CommonModule, Nav, Apropos, Competences, Projets, Experiences, Contacts, Footer],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export default class Acceuil {
 image = image
 fichier = fichier
isDownloading = false;
 downloadCV() {
    this.isDownloading = true;
    
    // Simuler un délai de téléchargement
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = fichier.cv;
      link.download = 'CV-Emmanuel-Bamidele.pdf';
      link.click();
      
      this.isDownloading = false;
    }, 2000); // 2 secondes de chargement
  }
}
