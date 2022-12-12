import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'endo-camera',
  templateUrl: './endo-camera.component.html',
  styleUrls: ['./endo-camera.component.css']
})
export class EndoCameraComponent implements OnInit,OnDestroy {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  error: any;
  private videoStream: MediaStream = null;
  mediaDeviceList: MediaDeviceInfo[] = [];
  activeVideoSource: string;

  constructor() { }

  ngOnInit() {
    this.startVideoStreaming();
  }
  startVideoStreaming()
  {
    const constraints = {
      video: {
        frameRate: { min: 8, max: 60 },
        facingMode: 'environment'
      },
      audio: false
    };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        var track = stream.getTracks()[0];
        var frIdeal = 35;
        var constrs = track.getConstraints();        
        var frCap = track.getCapabilities().frameRate;
        if (frCap && "min" in frCap && "max" in frCap) {
            constrs.frameRate = Math.max(frCap.min, Math.min(frCap.max, frIdeal));
            track.applyConstraints(constrs);
        }
        this.videoStream = stream;        
        this.videoElement.nativeElement.srcObject = this.videoStream;
        this.videoElement.nativeElement.play();
    });
    this.getCameraSelection();

  }
  getCameraSelection() {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      mediaDevices.forEach(item => {
        if(item.kind == "videoinput"){          
          this.mediaDeviceList.push(item);
        };
      });
    });
  }
  videoSourceChange(event){
   
    if(this.videoStream != null){
      this.videoElement.nativeElement.pause();     
      this.videoStream.getTracks().forEach(item => {
        item.stop();
      });
     this.videoElement.nativeElement.srcObject = null;
    }    
    this.startVideoStream(event);
    this.activeVideoSource = event;
  }
  startVideoStream(deviceId) {
    this.getMediaStream(deviceId)
      .then((stream) => {
        this.videoStream = stream;        
          this.videoElement.nativeElement.srcObject = this.videoStream;
          this.videoElement.nativeElement.play();
          this.activeVideoSource = deviceId;          
      })
      .catch((err) => { this.error = err.message + ' (' + err.name + ':' + err.constraintName + ')';
    });
  }
  
  private getMediaStream(id: string): Promise<MediaStream> {
    return new Promise<MediaStream>((resolve, reject) => {
      return navigator.mediaDevices.getUserMedia({
        video: { deviceId: id, frameRate: { min: 8, max: 60 }},audio: false})
        .then((stream) => {    
          var track = stream.getTracks()[0];
          var frIdeal = 35;
          var constrs = track.getConstraints();          
          var frCap = track.getCapabilities().frameRate;
          if (frCap && "min" in frCap && "max" in frCap) {
              constrs.frameRate = Math.max(frCap.min, Math.min(frCap.max, frIdeal));
              track.applyConstraints(constrs);
          } 
          return resolve(stream); 
        })
        .catch((err) => reject(err));
      }
    );    
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