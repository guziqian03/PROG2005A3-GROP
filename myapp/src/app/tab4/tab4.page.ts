import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, IonCardContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HelpsComponent } from '../helps/helps.component';
import { addIcons } from 'ionicons';
import { 

  helpCircle, lockClosed, shieldCheckmark, documentText, mail } from 'ionicons/icons';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HelpsComponent,
    IonButton, 
    IonIcon, 
    IonCardContent, 
    IonCardSubtitle, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    ExploreContainerComponent
  ],
})

export class Tab4Page {
  constructor() {
    addIcons({lockClosed,shieldCheckmark,documentText,mail,helpCircle});
  }



  showHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup4');
    if (helpPopup) {
      helpPopup.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background from scrolling
    }
  }
  
  closeHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup4');
    if (helpPopup) {
      helpPopup.style.display = 'none';
      document.body.style.overflow = ''; // Resume Scrolling
    }
  }
  

}
