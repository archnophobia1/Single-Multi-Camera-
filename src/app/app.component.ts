import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  btnCaption: string = "Switch to Multiple";
  isSingle: boolean = false;
  isEndo: boolean = false;
  isMulti:boolean = false;
  isResetcam = true;

  onBtnSingle(){
    this.isSingle = true;
    this.isEndo = false;
    this.isMulti = false;
    this.isResetcam = false;
  }
  onBtnMulti(){
    this.isSingle = false;
    this.isEndo = false;
    this.isMulti = true;
    this.isResetcam = false;
  }
  onBtnEndo(){
    this.isSingle = false;
    this.isEndo = true;
    this.isMulti = false;
    this.isResetcam = false;
  }
  onBtnClick(){
    this.isMulti = !this.isMulti;
    this.isResetcam = false;
    if(this.isMulti)
      this.btnCaption = "Switch to Single";
    if(!this.isMulti)
      this.btnCaption = "Switch to Multiple";
    

  }
  onResetCam(){
    this.isSingle = false;
    this.isEndo = false;
    this.isMulti = false;
    this.isResetcam = true;
  }
}
