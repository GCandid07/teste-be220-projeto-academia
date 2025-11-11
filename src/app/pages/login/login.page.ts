import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonLoading,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth';
import { UserService } from 'src/app/core/services/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonLoading
  ]
})
export class LoginPage implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  public loginForm!: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public isRegisterMode: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['']
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = null;

    const nameControl = this.loginForm.get('displayName');
    if (this.isRegisterMode) {
      nameControl?.setValidators(Validators.required);
    } else {
      nameControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();

    this.loginForm.reset();
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    const { email, password, displayName } = this.loginForm.value;

    this.isLoading = true;
    this.errorMessage = null;

    try {
      if (this.isRegisterMode) {
        const authCredential = await this.authService.register(email, password);
        const uid = authCredential.user.uid;

        await this.userService.saveNewUserData(uid, email, displayName);

        console.log('Cadastro e dados iniciais salvos com sucesso!');
      } else {
        const authCredential = await this.authService.login(email, password);
        const uid = authCredential.user.uid;

        await this.userService.fetchUserData(uid);

        console.log('Login e dados carregados com sucesso!');
      }

      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      let errorIdentifier: string = 'unknown-error';

      if (err && err.code && typeof err.code === 'string') {
        errorIdentifier = err.code;
      } else if (
        err &&
        err.error &&
        err.error.message &&
        typeof err.error.message === 'string'
      ) {
        errorIdentifier = err.error.message;
      }

      this.errorMessage = this.handleAuthError(errorIdentifier);
      console.error('Erro de autenticação completa:', err);
    } finally {
      this.isLoading = false;
    }
  }

  private handleAuthError(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha inválidos.';
      case 'auth/email-already-in-use':
        return 'O e-mail fornecido já está em uso.';
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      default:
        return `Erro desconhecido: ${errorCode}. Tente novamente mais tarde.`;
    }
  }
}
