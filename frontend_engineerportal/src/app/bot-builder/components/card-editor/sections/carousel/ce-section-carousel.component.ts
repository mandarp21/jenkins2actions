import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'ce-section-carousel',
  styleUrls: ['ce-section-carousel.component.sass'],
  templateUrl: 'ce-section-carousel.component.html'
})

/**
 *
 */
export class CECarouselSectionComponent {
  @Output()
  filesListUpdate = new EventEmitter();
  // form variables
  @Input()
  imageData: Array<any>;
  public files: UploadFile[] = [];
  imgTitle: string;
  imgUrl: string;

  botIconErrorHandler() {}

  removeImg(data) {
    this.imageData.splice(this.imageData.indexOf(data), 1);
    this.filesListUpdate.emit(this.imageData);
  }

  addImage() {
    if (this.imgTitle) {
      this.imageData.push({ title: this.imgTitle, url: this.imgUrl });
      this.imgTitle = '';
      this.imgUrl = '';
      this.filesListUpdate.emit(this.imageData);
    }
  }
}
