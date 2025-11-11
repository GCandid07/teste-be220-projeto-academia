import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonIcon]
})
export class ActionCardComponent {
  @Output() actionClick = new EventEmitter<void>();
  @Input() imageUrl: string | null = null;

  onClick() {
    this.actionClick.emit();
  }

  get cardStyles() {
    return this.imageUrl
      ? { '--action-card-background-image': `url(${this.imageUrl})` }
      : null;
  }
}
