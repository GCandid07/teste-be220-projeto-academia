import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, firstValueFrom } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  MenuController,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heartOutline,
  calendarOutline,
  menuOutline,
  notificationsOutline,
  bodyOutline,
  trophyOutline,
  addCircleOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth';
import {
  ActionCardComponent
} from 'src/app/components/action-card/action-card.component';
import {
  CourseCardComponent
} from 'src/app/components/course-card/course-card.component';
import { UserService } from 'src/app/core/services/user';
import { UserData } from 'src/app/models/user.model';
import { StorageService } from 'src/app/core/services/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    ActionCardComponent,
    CourseCardComponent,
  ],
})
export class HomePage implements OnInit {
  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private menuCtrl: MenuController = inject(MenuController);
  private modalCtrl: ModalController = inject(ModalController);
  private storageService: StorageService = inject(StorageService);
  private alertController: AlertController = inject(AlertController);

  public user$: Observable<any> = this.authService.user$;

  public currentHeaderHeight: string = 'auto';
  public currentProfileOpacity: number = 1;
  public currentProfileScale: number = 1;

  private PROFILE_AREA_HEIGHT = 120;
  private TOOLBAR_HEIGHT = 46;
  private SCROLL_THRESHOLD = this.PROFILE_AREA_HEIGHT;

  private topSafeArea = 0;
  private fullHeaderHeight = 0;
  private condensedHeaderHeight = 0;

  public userData$: Observable<UserData | null> = this.userService.currentUser$;

  public personalOnlineCourses = [
    {
      title: 'Yoga Express',
      subtitle: null,
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: 'Treino HIIT',
      subtitle: null,
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
  ];

  public programs = [
    {
      title: 'Levantamento de Peso',
      subtitle: 'Continuar treino',
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: 'Yoga Express',
      subtitle: null,
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: 'Foco e Força',
      subtitle: null,
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: 'Zumba',
      subtitle: null,
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: 'Spinning',
      subtitle: null,
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
  ];

  public contentItems = [
    {
      title: '',
      subtitle: null,
      cardClass: 'content-card small-content-card orange-box',
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: '',
      subtitle: null,
      cardClass: 'content-card small-content-card',
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
    {
      title: '',
      subtitle: null,
      cardClass: 'content-card small-content-card',
      imageUrl: 'assets/images/lifter-mock.jpg'
    },
  ];

  constructor() {
    addIcons({
      heartOutline,
      calendarOutline,
      menuOutline,
      notificationsOutline,
      bodyOutline,
      trophyOutline,
      addCircleOutline,
    });
  }

  ngOnInit() {
    const safeAreaCss = getComputedStyle(document.documentElement)
      .getPropertyValue('--ion-safe-area-top');
    this.topSafeArea = parseFloat(safeAreaCss) || 0;

    this.fullHeaderHeight =
      this.topSafeArea + this.TOOLBAR_HEIGHT + this.PROFILE_AREA_HEIGHT;
    this.condensedHeaderHeight = this.topSafeArea + this.TOOLBAR_HEIGHT;

    this.currentHeaderHeight = `${this.fullHeaderHeight}px`;
  }

  handleScroll(event: any) {
    const scrollTop = event.detail.scrollTop;

    let heightToSubtract = Math.min(scrollTop, this.SCROLL_THRESHOLD);
    let newHeaderHeight = this.fullHeaderHeight - heightToSubtract;

    newHeaderHeight = Math.max(newHeaderHeight, this.condensedHeaderHeight);

    this.currentHeaderHeight = `${newHeaderHeight}px`;

    const factor = 1 - heightToSubtract / this.SCROLL_THRESHOLD;

    this.currentProfileOpacity = factor;
    this.currentProfileScale = factor;

    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      contentElement.style.setProperty('--padding-top', `${newHeaderHeight}px`);
    }
  }

  async openSideMenu() {
    await this.menuCtrl.enable(true, 'main-menu');
    await this.menuCtrl.open('main-menu');
  }

  async openNotifications() {
    alert('Função de Notificações Ativada!');
  }

  handleNewWorkout() {
    console.log('Abrir modal/página de Novo Treino');
  }

  async handleProfilePhotoClick() {
    const user = await firstValueFrom(this.authService.user$);

    if (!user) {
      console.error('Usuário não autenticado.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event: any) => {
      const file: File = event.target.files[0];
      if (file) {
        await this.uploadNewPhoto(file, user.uid);
      }
    };

    input.click();
  }

  async uploadNewPhoto(file: File, uid: string) {
    const loadingAlert = await this.alertController.create({
      message: 'Carregando nova foto...',
      backdropDismiss: false,
    });
    await loadingAlert.present();

    try {
      await this.storageService.uploadProfilePicture(file, uid);
    } catch (error) {
      console.error('Falha no upload:', error);
      const errorAlert = await this.alertController.create({
        header: 'Erro no Upload',
        message: 'Ocorreu um erro ao salvar a foto. Tente novamente.',
        buttons: ['OK'],
      });
      await errorAlert.present();
    } finally {
      await loadingAlert.dismiss();
    }
  }
}
