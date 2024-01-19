import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserInterface } from '../models/user.interface';

export function usernameAvailabilityValidator(
  userService: UserService,
  myUsername?: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.value;
    return userService.checkIfUsernameExists(username).pipe(
      map((userWithUsername: UserInterface) => {
        if (myUsername && myUsername === username) return null;
        return userWithUsername ? { usernameExists: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}
