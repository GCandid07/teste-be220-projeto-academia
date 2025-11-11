import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap, first } from 'rxjs/operators';
import { AuthService } from '../services/auth';

/**
 * Guard de rotas, para checar se o usuário está autenticado.
 * * Se o usuário estiver logado, permite o acesso (true).
 * * Se o usuário não estiver logado, redireciona para a página de login.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    first(),
    map(user => !!user),

    tap(isAuthenticated => {
      if (!isAuthenticated) {
        console.warn('AuthGuard: Acesso negado. Redirecionando para Login.');

        router.navigate(['/login']);
      }
    })
  );
};
