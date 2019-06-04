import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth,
                private router: Router,
                private afDB: AngularFirestore,
                private store: Store<AppState> ) { }

  initAuthListener() {

    this.afAuth.authState
      .subscribe( (fbUser: firebase.User) => {

        if ( fbUser ) {
          this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges()
            .subscribe( usuarioObj => {

              console.log(usuarioObj)

            });
        }

      });

  }

  crearUsuario( name: string, email: string, password: string ) {

    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
        .then( resp => {

          const user: User = {
            uid: resp.user.uid,
            name: name,
            email: email
          };

          this.afDB.doc(`${ user.uid }/usuario`)
            .set( user )
            .then(() => {
              this.router.navigate(['/']);
              this.store.dispatch( new DesactivarLoadingAction() );
            });
        })
        .catch(error => {
          this.store.dispatch( new DesactivarLoadingAction() );
          Swal.fire('Error en el login', error.message, 'error');
        });

  }

  login( email:string, password: string ) {

    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
        .then( () => {
          this.router.navigate(['/']);
        })
        .catch(error => {
          Swal.fire('Error en el login', error.message, 'error');
        })
        .finally(() => {
          this.store.dispatch( new DesactivarLoadingAction() );
        });

  }

  logout() {

    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);

  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {

          if ( fbUser === null ) {
            this.router.navigate(['/login']);
          }

          return fbUser !== null
        })
      );
  }

}
