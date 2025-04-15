import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, IonCardContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HelpsComponent } from '../helps/helps.component';
import { addIcons } from 'ionicons';
import { 

  helpCircle 
} from 'ionicons/icons';

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
    addIcons({
      helpCircle
    });
  }
}