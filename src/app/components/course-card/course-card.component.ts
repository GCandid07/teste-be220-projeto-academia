import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard } from '@ionic/angular/standalone';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard]
})
export class CourseCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string | null = null;
  @Input() cardClass: string = 'content-card';
  @Input() imageUrl: string | null = null;

  get cardStyles() {
    return this.imageUrl
      ? { '--course-card-background-image': `url(${this.imageUrl})` }
      : null;
  }
}
