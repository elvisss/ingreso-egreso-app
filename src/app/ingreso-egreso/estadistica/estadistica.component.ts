import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;

  countIngresos: number;
  countEgresos: number;

  subscription: Subscription = new Subscription();

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: number[] = [];

  constructor( private store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe( ingresoEgreso => {
        this.countIngresoEgreso(ingresoEgreso.items);
      });
  }

  countIngresoEgreso(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;

    this.countIngresos = 0;
    this.countEgresos = 0;

    items.forEach( item => {

      if ( item.type === 'ingreso' ) {
        this.countIngresos++;
        this.ingresos += item.amount;
      } else {
        this.countEgresos++;
        this.egresos += item.amount;
      }

    });

    this.doughnutChartData = [ this.ingresos, this.egresos ];

  }

}
