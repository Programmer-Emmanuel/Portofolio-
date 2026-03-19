// contacts.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';

interface Contact {
  id: number;
  nom: string;
  icone: string;
  valeur: string;
  lien: string;
  couleur: string;
}

@Component({
  selector: 'app-contacts',
  imports: [CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
}) 

export class Contacts implements OnInit {

  contacts: Contact[] = [
    {
      id: 1,
      nom: 'GitHub',
      icone: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      valeur: 'github.com/Programmer-Emmanuel',
      lien: 'https://github.com/Programmer-Emmanuel',
      couleur: 'gray'
    },
    {
      id: 2,
      nom: 'LinkedIn',
      icone: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      valeur: 'linkedin.com/in/emmanuel-bamidele-b63a49274',
      lien: 'https://www.linkedin.com/in/emmanuel-bamidele-b63a49274',
      couleur: 'blue'
    },
    {
      id: 3,
      nom: 'Email',
      icone: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      valeur: 'marcbamidele@gmail.com',
      lien: 'mailto:marcbamidele@gmail.com',
      couleur: 'red'
    },
    {
      id: 4,
      nom: 'WhatsApp',
      icone: 'M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.45-1.272.61-1.447c.159-.175.347-.219.462-.219.115 0 .231.001.346.001.115.001.259-.042.405.312.146.354.495 1.223.54 1.311.045.089.072.192.014.313-.058.12-.087.194-.173.298-.087.104-.184.232-.261.313-.087.087-.179.183-.077.358.101.175.449.774.963 1.254.662.617 1.215.824 1.391.903.175.078.277.063.379-.038.101-.104.449-.524.569-.704.12-.179.24-.149.404-.089.164.06 1.046.493 1.227.583.179.09.298.134.342.209.044.075.044.433-.101.838z',
      valeur: '+225 01 400 226 93',
      lien: 'https://wa.me/2250140022693',
      couleur: 'green'
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

  texte_whatsapp = "";
  texte_email = "";

  copyToClipboard(text: string, type: 'email' | 'whatsapp') {
    navigator.clipboard.writeText(text).then(() => {

      if (type === 'email') {
        this.texte_email = "✅";
      }

      if (type === 'whatsapp') {
        this.texte_whatsapp = "✅";
      }

      // (optionnel) reset après 2 secondes
      setTimeout(() => {
        this.texte_email = "";
        this.texte_whatsapp = "";
      }, 2000);

    });
  }
}