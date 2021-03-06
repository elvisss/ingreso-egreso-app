import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { User } from '../../auth/user.model';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  name: string;
  subscription: Subscription = new Subscription();

  constructor( public authService: AuthService,
               private store: Store<AppState>,
               public ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
      .pipe(
        filter( auth => auth.user !== null )
      )
      .subscribe( auth => {
        this.name = auth.user.name;
      });
  }

  logout() {
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
