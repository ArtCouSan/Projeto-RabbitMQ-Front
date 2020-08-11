import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatRippleModule, MatTabsModule, MatTableModule, MatSlideToggleModule, MatRadioModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DroneComponent } from './modules/drone/drone.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    DroneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatRippleModule,
    MatTableModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatRadioModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBV8HI0FfMpW6_gRrTHQZ6BL5dWsWR00y0'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
