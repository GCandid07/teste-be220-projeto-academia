import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UserData } from 'src/app/models/user.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  private currentUserSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  public currentUser$: Observable<UserData | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.fetchUserData(user.uid);
      } else {
        this.clearUserData();
      }
    });
  }

  /**
   * Transforma o nome completo em apenas uma e/ou duas letras iniciais.
   * @param name O nome completo fornecido durante o cadastro.
   */
  private getInitials = (name?: string): string => {
    if (!name) return 'P';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'P';

    const first = parts[0]?.[0]?.toUpperCase() || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0]?.toUpperCase() : '';

    return `${first}${last}`;
  };

  /**
   * Salva os dados iniciais do usuário no Firestore após o cadastro.
   * @param uid O ID do usuário (do Auth).
   * @param email O email do usuário.
   * @param displayName O nome completo fornecido durante o cadastro.
   */
  public async saveNewUserData(uid: string, email: string, displayName: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);

    const initials = this.getInitials(displayName)

    const initialData: UserData = {
      uid: uid,
      email: email,
      displayName: displayName,
      level: 'Roxo',
      profilePicture:
        `https://placehold.co/60x60/333333/FFFFFF?text=${initials}`,
    };

    await setDoc(userDocRef, initialData, { merge: false });
    console.log(`Dados do usuário ${uid} salvos no Firestore.`);
    this.setUserData(initialData);
  }

  /**
   * Carrega os dados do usuário do Firestore e atualiza o estado.
   * @param uid O ID do usuário.
   */
  public async fetchUserData(uid: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);

    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data() as UserData;
        this.setUserData(userData);
        console.log(`Dados do usuário ${uid} carregados.`);
      } else {
        console.warn(`Nenhum dado encontrado no Firestore para o UID: ${uid}`);
        this.clearUserData();
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Firestore:', error);
      this.clearUserData();
    }
  }

  /**
   * Atualiza apenas a foto de perfil do usuário no Firestore.
   * @param uid O ID do usuário.
   * @param photoURL A nova URL da foto.
   */
  public async updateProfilePicture(uid: string, photoURL: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);

    await updateDoc(userDocRef, {
      profilePicture: photoURL
    });

    const currentData = this.currentUserSubject.getValue();
    if (currentData) {
      this.setUserData({ ...currentData, profilePicture: photoURL });
      console.log('Foto de perfil atualizada e estado local sincronizado.');
    }
  }

  public setUserData(userData: UserData): void {
    this.currentUserSubject.next(userData);
  }

  public clearUserData(): void {
    this.currentUserSubject.next(null);
  }
}
