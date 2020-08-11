import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DroneComponent } from './modules/drone/drone.component';


const routes: Routes = [
  {
    path: '',
    component: DroneComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
