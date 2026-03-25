// chat.component.ts
import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Nav } from '../../components/nav/nav';
import * as AOS from 'aos';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, Nav],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export default class Chat implements OnInit, AfterViewChecked {
  
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  constructor(private cd: ChangeDetectorRef) {}

  messages: Message[] = [];
  userInput: string = '';
  isTyping: boolean = false;
  
  // Exemples de questions pour l'utilisateur
  exampleQuestions: string[] = [
    "Quelles sont ses compétences techniques ?",
    "Comment contacter Emmanuel ?",
    "Est-il disponible pour des missions freelance ?",
    "Quelles sont ses expériences professionnelles ?",
    "Quels projets a-t-il réalisés ?",
    "Quelles technologies utilise-t-il pour le backend ?",
    "Fait-il du développement mobile ?",
    "Où est-il basé ?"
  ];
  
  // Informations personnelles pour le chatbot
  private personalInfo = {
    nom: 'Emmanuel Bamidélé',
    prenom: 'Emmanuel',
    titre: 'Développeur Fullstack orienté Backend',
    ville: 'Abidjan, Côte d\'Ivoire',
    email: 'marcbamidele@gmail.com',
    github: 'github.com/Programmer-Emmanuel',
    linkedin: 'linkedin.com/in/emmanuel-bamidele-b63a49274',
    telephone: '+225 01 400 226 93',
    whatsapp: '+225 01 400 226 93',
    competences: [
      'Développement Frontend (React.js, Angular, TypeScript, Tailwind CSS)',
      'Développement Backend (Laravel, PHP, Python)',
      'Développement Mobile (React Native)',
      'Conception d\'API REST',
      'Gestion de bases de données (MySQL, PostgreSQL)',
      'UI/UX Design',
      'Optimisation & Performance',
      'Sécurité des applications'
    ],
    experiences: [
      'Stage à NEURA COMPUTING - Développeur fullstack (2025)',
      '2ème Place au YADAC ROBOTICS CHALLENGE (2025)',
    ],
    projets: [
      'Plateforme E-commerce avec Angular et Laravel',
      'Application de gestion de tâches collaborative avec React et Node.js',
      'Dashboard Analytics avec Angular et D3.js',
      'Application mobile Fitness avec React Native et Firebase',
      'API de paiement sécurisée avec Laravel et Stripe'
    ],
    disponibilite: 'Disponible pour missions freelance et opportunités professionnelles',
    bio: 'Développeur fullstack orienté backend, passionné par la création d\'architectures robustes et d\'APIs performantes. J\'utilise Laravel, React, Angular et React Native pour créer des applications modernes.'
  };
  
  private greetings = ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey'];
  private farewells = ['au revoir', 'bye', 'ciao', 'à plus', 'adieu'];
  
  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-in-out'
    });
    
    // Message de bienvenue
    setTimeout(() => {
      this.addBotMessage('👋 Bonjour ! Je suis l\'assistant d\'Emmanuel. Posez-moi toutes vos questions sur son parcours, ses compétences, ou ses disponibilités !');
    }, 500);
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
  
  sendMessage() {
    if (!this.userInput.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now(),
      text: this.userInput,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    
    const userQuestion = this.userInput.toLowerCase();
    this.userInput = '';
    
    // Simuler la frappe du bot
    this.isTyping = true;
    
    setTimeout(() => {
      const botResponse = this.generateResponse(userQuestion);
      this.addBotMessage(botResponse);
      this.isTyping = false;
      // Forcer Angular à mettre à jour l'affichage
      this.cd.detectChanges();
      this.scrollToBottom();        
    }, 500 + Math.random() * 500);
  }
  
  addBotMessage(text: string) {
    const botMessage: Message = {
      id: Date.now(),
      text: text,
      isUser: false,
      timestamp: new Date()
    };
    this.messages.push(botMessage);
  }
  
  generateResponse(question: string): string {
    
    // Salutations
    if (this.greetings.some(greeting => question.includes(greeting))) {
      return 'Bonjour ! 😊 Je suis l\'assistant d\'Emmanuel. Que voulez-vous savoir sur lui ? Ses compétences, son parcours, ou comment le contacter ?';
    }
    
    // Au revoir
    if (this.farewells.some(farewell => question.includes(farewell))) {
      return 'Au revoir ! N\'hésitez pas à revenir si vous avez d\'autres questions sur Emmanuel. Passez une excellente journée ! 👋';
    }
    
    // Qui es-tu / présentation
    if (question.includes('qui es-tu') || question.includes('présente-toi') || question.includes('ton nom')) {
      return `🤖 Je suis l'assistant virtuel d'${this.personalInfo.nom}. Je suis là pour répondre à toutes vos questions sur son parcours, ses compétences, ses projets et comment le contacter !`;
    }

  if (question.includes('emmanuel') || question.includes('bamidélé') || question.includes('bamidele')) {
    return `👤 ${this.personalInfo.nom} est un développeur Fullstack orienté backend. 
  Il maîtrise Laravel, PHP, MySQL/PostgreSQL, React.js, Angular, Tailwind CSS et React Native pour le développement mobile. 
  💻 Ses compétences incluent le développement Frontend, Backend, Mobile, la conception d'API, la gestion de bases de données, et l'optimisation des applications. 
  📍 Il est basé à ${this.personalInfo.ville} et est disponible pour des missions freelance ou des collaborations. 
  📱 Vous pouvez le contacter par email, téléphone ou WhatsApp pour toute demande professionnelle.`;
  }
    
    // Nom / identité
    if (question.includes('nom') || question.includes('appelle')) {
      return `👤 Il s'appelle ${this.personalInfo.nom}. Vous pouvez l'appeler Emmanuel.`;
    }
    
    // Compétences
    if (question.includes('compétence') || question.includes('compétences') || question.includes('sais faire') || question.includes('techno') || question.includes('langage') || question.includes('technologies')) {
      const competencesList = this.personalInfo.competences.map(c => `• ${c}`).join('\n');
      return `💻 ${this.personalInfo.nom} maîtrise plusieurs technologies :\n\n${competencesList}\n\nC'est un développeur fullstack polyvalent !`;
    }
    
    // Expériences
    if (question.includes('expérience') || question.includes('expériences') || question.includes('parcours') || question.includes('stage') || question.includes('travail') || question.includes('carrière')) {
      const experiencesList = this.personalInfo.experiences.map(e => `• ${e}`).join('\n');
      return `📋 Voici son parcours :\n\n${experiencesList}`;
    }
    
    // Projets
    if (question.includes('projet') || question.includes('projets') || question.includes('réalisation') || question.includes('création') || question.includes('portfolio')) {
      const projetsList = this.personalInfo.projets.map(p => `• ${p}`).join('\n');
      return `🚀 ${this.personalInfo.nom} a réalisé plusieurs projets notables :\n\n${projetsList}\n\nVous pouvez retrouver tous ses projets sur la page Projets de son portfolio !`;
    }
    
    // Disponibilité
    if (question.includes('disponible') || question.includes('disponibilité') || question.includes('freelance') || question.includes('mission') || question.includes('embauche') || question.includes('recrute')) {
      return `✅ ${this.personalInfo.disponibilite}. N'hésitez pas à le contacter via ses réseaux ou par email pour discuter de vos projets !`;
    }
    
    // Contact
    if (question.includes('contact') || question.includes('mail') || question.includes('email') || question.includes('téléphone') || question.includes('whatsapp') || question.includes('joindre') || question.includes('réseaux')) {
      return `📱 Voici comment contacter ${this.personalInfo.nom} :\n\n📧 Email : ${this.personalInfo.email}\n📱 Téléphone/WhatsApp : ${this.personalInfo.telephone}\n💻 GitHub : ${this.personalInfo.github}\n🔗 LinkedIn : ${this.personalInfo.linkedin}`;
    }
    
    // Backend / Laravel / API
    if (question.includes('backend') || question.includes('laravel') || question.includes('api') || question.includes('serveur')) {
      return `⚙️ ${this.personalInfo.nom} est un développeur fullstack orienté backend. Il excelle particulièrement avec Laravel pour la création d'APIs robustes et d'architectures scalables. Il maîtrise également PHP, MySQL et PostgreSQL.`;
    }
    
    // Frontend / React / Angular
    if (question.includes('frontend') || question.includes('react') || question.includes('angular') || question.includes('tailwind') || question.includes('css')) {
      return `🎨 Côté frontend, ${this.personalInfo.nom} utilise React.js et Angular pour créer des interfaces modernes, avec Tailwind CSS pour un design responsive et élégant.`;
    }
    
    // Mobile / React Native
    if (question.includes('mobile') || question.includes('react native') || question.includes('android') || question.includes('ios')) {
      return `📱 Pour le développement mobile, ${this.personalInfo.nom} utilise React Native pour créer des applications cross-platform performantes pour iOS et Android.`;
    }
    
    // Formation / études
    if (question.includes('formation') || question.includes('étude') || question.includes('diplôme') || question.includes('école') || question.includes('certification')) {
      return `🎓 ${this.personalInfo.nom} a suivi une formation intensive en développement fullstack et continue d'apprendre en permanence pour rester à jour avec les dernières technologies. Il est passionné par l'apprentissage continu.`;
    }
    
    // Ville / localisation
    if (question.includes('ville') || question.includes('où') || question.includes('localisation') || question.includes('habite') || question.includes('pays')) {
      return `📍 ${this.personalInfo.nom} est basé à ${this.personalInfo.ville}. Il travaille à distance et est ouvert aux collaborations partout dans le monde ! 🌍`;
    }
    
    // Réponse par défaut pour les questions hors sujet
    if (!question.includes('emmanuel') && !question.includes('bamidélé')) {
      return `🤔 Désolé, je ne peux répondre qu'aux questions concernant ${this.personalInfo.nom}. Voici ce que je peux vous dire sur lui :\n\n• Ses compétences techniques\n• Son parcours et expériences\n• Ses projets réalisés\n• Ses disponibilités\n• Ses coordonnées\n\nQue souhaitez-vous savoir exactement ?`;
    }
    
    // Réponse par défaut
    return `🤔 Je n'ai pas bien compris votre question. Voici ce que je peux vous dire sur ${this.personalInfo.nom} :\n\n• Ses compétences techniques\n• Son parcours et expériences\n• Ses projets réalisés\n• Ses disponibilités\n• Ses coordonnées\n\nQue souhaitez-vous savoir exactement ?`;
  }
  
  clearChat() {
    this.messages = [];
    this.addBotMessage('🧹 Chat réinitialisé ! Posez-moi vos questions sur Emmanuel.');
  }
  
  useExampleQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }
  
  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}