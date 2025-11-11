import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuToggle,
  MenuController,
  AlertController,
  IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  calendarOutline,
  trendingUpOutline,
  settingsOutline,
  logOutOutline,
  person
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth';
import { UserService } from './core/services/user';
import { UserData } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonMenuToggle,
    IonFooter,
  ],
})
export class AppComponent {
  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private menuCtrl: MenuController = inject(MenuController);
  private alertController: AlertController = inject(AlertController);

  public userData$: Observable<UserData | null> = this.userService.currentUser$;

  constructor() {
    addIcons({
      homeOutline,
      calendarOutline,
      trendingUpOutline,
      settingsOutline,
      logOutOutline,
      person
    });
  }

  async logout() {
    const modal = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sair',
          handler: async () => {
            try {
              await this.authService.logout();
              this.userService.clearUserData();
              await this.menuCtrl.close('main-menu');
              this.router.navigateByUrl('/login', { replaceUrl: true });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              const errorModal = await this.alertController.create({
                header: 'Erro',
                message: 'Não foi possível fazer logout. Tente novamente.',
                buttons: ['OK'],
              });
              await errorModal.present();
            }
          },
        },
      ],
    });
    await modal.present();
  }
}
