import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  public readonly user$: Observable<User | null> = user(this.auth);

  constructor() {
    this.user$.subscribe(user => {
      console.log('Firebase User Status:', user ? `LOGGED IN (${user.uid})` : 'LOGGED OUT');
    });
  }

  /**
   * Cadastro de um novo usuário usando E-mail e Senha.
   * @param email O email do usuário.
   * @param password A senha do usuário.
   * @returns Promise com o resultado da autenticação (UserCredential).
   */
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      console.error('Erro no Cadastro:', error);
      throw error;
    }
  }

  /**
   * Login de um usuário existente.
   * @param email O email do usuário.
   * @param password A senha do usuário.
   * @returns Promise com o resultado da autenticação (UserCredential).
   */
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      console.error('Erro no Login:', error);
      throw error;
    }
  }

  /**
   * Desloga o usuário atual.
   * @returns Promise vazia.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Erro no Logout:', error);
      throw error;
    }
  }
}
