import { Component } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { helpCircle } from 'ionicons/icons';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class HelpsComponent {
  constructor() {
    addIcons({
      helpCircle
    });
  }
}
