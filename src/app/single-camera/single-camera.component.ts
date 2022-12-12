import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'single-camera',
  templateUrl: './single-camera.component.html',
  styleUrls: ['./single-camera.component.css']
})
export class SingleCameraComponent implements OnInit,OnDestroy {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  error: any;
  private videoStream: MediaStream = null;

  constructor() { }

  ngOnInit() {
    this.startVideoStream();
  }
  startVideoStream() {
    this.getMediaStream()
      .then((stream) => {
        this.videoStream = stream;  
        this.videoElement.nativeElement.srcObject = this.videoStream;
        this.videoElement.nativeElement.play();  
      })
      .catch((err) => { this.error = err.message + ' (' + err.name + ':' + err.constraintName + ')';
    });
  }
  private getMediaStream(): Promise<MediaStream> {
    const video_constraints = {
      video: true
    };
    var browser = <any>navigator;   
    const _video = this.videoElement.nativeElement;
    browser.getUserMedia = browser.getUserMedia || browser.webkitGetUserMedia || browser.mozGetUserMedia || browser.msGetUserMedia;
    return new Promise<MediaStream>((resolve, reject) => {
      return browser.mediaDevices.getUserMedia(video_constraints)
      .then((stream) => {
        return resolve(stream);
      })
      .catch((err) => reject(err));
    });
  }
  ngOnDestroy() {       
    this.stopVideoStream();
  }
  stopVideoStream() {
    if(this.videoStream != null){
      this.videoElement.nativeElement.pause();     
      this.videoStream.getTracks().forEach(item => {
        item.stop();        
      });
      this.videoElement.nativeElement.srcObject = null;
    }
  }

}