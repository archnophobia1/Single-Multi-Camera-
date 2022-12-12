import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'multi-camera',
  templateUrl: './multi-camera.component.html',
  styleUrls: ['./multi-camera.component.css'],
})
export class MultiCameraComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  error: any;
  private videoStream: MediaStream = null;
  mediaDeviceList: MediaDeviceInfo[] = [];
  activeVideoSource: string;
  videoHeight: number;
  videoWidth: number;

  constructor() {}

  ngOnInit() {
    this.openComPort();
    this.getVideoSources();
  }

  async openComPort()
  {
    let reader: ReadableStreamDefaultReader;
    let writer: WritableStreamDefaultWriter;
    if ('serial' in navigator) {
      try {
        
        const bufferSize = 1024; // 1kB
        let buffer = new ArrayBuffer(bufferSize);
        

        const port = await (navigator as any).serial.requestPort();

       
        //await port.open({ baudRate: 9600 });
        while (port.readable) {
          reader = port.readable.getReader();
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                // reader.cancel() has been called.
                break;
              }
              // value is a Uint8Array.
              console.log(value);
            }
          } catch (error) {
            // Handle error...
          } finally {
            // Allow the serial port to be closed later.
            reader.releaseLock();
          }
        }      
        await port.close();
        
        
        //reader = port.readable.getReader();
        //console.log(reader.releaseLock)
        // let signals = await port.getSignals();
        // console.log(signals);


        // const port = await (navigator as any).serial.requestPort();
        // await port.open({ baudrate: 9600 });
        // reader = port.readable.getReader();
        //console.log("reader",reader);
        //writer = port.writable.getWriter();
      } catch(err) {
        console.error('There was an error opening the serial port:', err);
      }
    } else {
      console.error('Enable web serial on your browser.')
    }
  }


  getVideoSources() {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      mediaDevices.forEach((item) => {
        if (item.kind == 'videoinput') {
          this.mediaDeviceList.push(item);
        }
      });
      if (this.mediaDeviceList.length > 0) {
        this.startVideoStream(this.mediaDeviceList[0].deviceId);        
      }
    });
  }
  videoSourceChange(event) {
    this.videoElement.nativeElement.pause();
    this.videoElement.nativeElement.srcObject = null;
    if (this.videoStream != null) {
      this.videoElement.nativeElement.pause();
      this.videoStream.getTracks().forEach((item) => {
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
        console.log(stream.getVideoTracks()[0].getSettings().aspectRatio);         
        this.videoWidth = stream.getVideoTracks()[0].getSettings().width;
        this.videoHeight = stream.getVideoTracks()[0].getSettings().height;        
        //this.videoHeight = Math.floor(stream.getVideoTracks()[0].getSettings().width/stream.getVideoTracks()[0].getSettings().aspectRatio);         
        this.videoElement.nativeElement.srcObject = this.videoStream;
        this.videoElement.nativeElement.play();
        this.activeVideoSource = deviceId;
      })
      .catch((err) => {
        this.error =
          err.message + ' (' + err.name + ':' + err.constraintName + ')';
      });
  }
  private getMediaStream(id: string): Promise<MediaStream> {
    return new Promise<MediaStream>((resolve, reject) => {
      return navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: id },
        })
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
    if (this.videoStream != null) {
      this.videoElement.nativeElement.pause();
      this.videoStream.getTracks().forEach((item) => {
        item.stop();
      });
      this.videoElement.nativeElement.srcObject = null;
    }
  }
}
