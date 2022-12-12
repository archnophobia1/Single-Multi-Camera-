import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SingleCameraComponent } from './single-camera/single-camera.component';
import { MultiCameraComponent } from './multi-camera/multi-camera.component';
import { ClearCameraComponent } from './clear-camera/clear-camera.component';
import { EndoCameraComponent } from './endo-camera/endo-camera.component';


@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SingleCameraComponent,MultiCameraComponent,ClearCameraComponent,EndoCameraComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
