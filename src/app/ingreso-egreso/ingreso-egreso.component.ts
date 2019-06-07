import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import * as fromIngresoEgreso from './ingreso-egreso.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  type = 'ingreso';

  loading: boolean;
  loadingSubs: Subscription = new Subscription();

  constructor( public ingresoEgresoService: IngresoEgresoService,
               private store: Store<fromIngresoEgreso.AppState> ) { }

  ngOnInit() {
    this.form = new FormGroup({
      description: new FormControl('', Validators.required),
      amount: new FormControl(0, Validators.min(0)),
    });

    this.loadingSubs = this.store.select('ui')
      .subscribe( ui => {
        this.loading = ui.isLoading;
      });
  }

  crearIngresoEgreso() {
    this.store.dispatch( new ActivarLoadingAction() );
    const ingresoEgreso = new IngresoEgreso({ ...this.form.value, type: this.type });
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        Swal.fire('Creado', ingresoEgreso.description, 'success');
        this.form.reset({ amount: 0 });
      })
      .finally( () => {
        this.store.dispatch( new DesactivarLoadingAction() );
      });
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

}
