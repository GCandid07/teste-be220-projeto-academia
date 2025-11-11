import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';
import { UserService } from './user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage = inject(Storage);
  private userService: UserService = inject(UserService);

  constructor() { }

  /**
   * Faz o upload de uma imagem e atualiza a URL no Firestore.
   * @param file O arquivo File (imagem) a ser enviado.
   * @param uid O ID do usuário logado.
   * @returns A URL pública do arquivo.
   */
  async uploadProfilePicture(file: File, uid: string): Promise<string> {
    const filePath = `users/${uid}/profile.jpg`;
    const storageRef = ref(this.storage, filePath);

    console.log(`Iniciando upload para: ${filePath}`);

    try {
      const uploadResult = await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(uploadResult.ref);

      console.log('Upload concluído. URL:', downloadURL);

      await this.userService.updateProfilePicture(uid, downloadURL);

      return downloadURL;

    } catch (e) {
      console.error('Erro durante o upload da imagem de perfil:', e);
      throw new Error('Não foi possível carregar a imagem de perfil.');
    }
  }
}
