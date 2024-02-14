import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'bot-info-form',
  styleUrls: ['new-bot-info.component.sass'],
  templateUrl: 'new-bot-info.component.html'
})
export class NewBotInfoComponent implements OnInit {
  @Input()
  botStatusVisiblity;
  boolean;
  @Input()
  botType: string;
  @Input()
  botForm: FormGroup;
  @Input()
  wideBotInfoCard: boolean;
  @Output()
  toggleBotInfoToolTip: EventEmitter<boolean>;
  botImage: string;
  authButtonDisabled: boolean;
  isValidUrl: boolean;
  formErrorImageURL: boolean;
  formErrorTelephone: boolean;
  botImagePatternError: boolean;
  botImageSizeError: boolean;
  toolTipFlag = false;

  constructor(private toasterService: ToastrService) {
    this.botStatusVisiblity = false;
    this.authButtonDisabled = false;
    this.formErrorImageURL = false;
    this.formErrorTelephone = false;
    this.botImagePatternError = false;
    this.botImageSizeError = false;
    this.toggleBotInfoToolTip = new EventEmitter();
  }

  ngOnInit() {
    if  (this.botForm.get('botImage')) {
      this.botForm.get('botImage').valueChanges.subscribe(
        newValue => {
          if(newValue === ''){
            this.botImage = 'assets/img/Bot_Icon.png';
          }
          if(!this.botForm.get('botImage').errors) {

            let img = new Image();
            img.src =  newValue;
            img.onload = () => {
              console.log(img.width);
              console.log(img.height);
              if(img.width > 100 || img.height > 100) {
                this.isValidUrl = false;
                this.botImage = null;
                this.botForm.patchValue(
                  { botImage:  '' }
                );
                this.formErrorImageURL = true;
                this.botImageSizeError = true;
              } else {
                this.isValidUrl = true;
                this.botImage = this.botForm.get('botImage').value;
              }
            };
          } else {
            this.botImage =  null;
          }
        }
      );
    }
  }

  /**
   * @description - Method - to activate/deactivate tooltip and emit the event for Bot Info section
   * @returns - void
   */
  toggleToolTipBotInfo(): void {
    this.toolTipFlag = !this.toolTipFlag;
    this.toggleBotInfoToolTip.emit(this.toolTipFlag);
  }
  botIconErrorHandler() {
    this.botImage = null;
    this.isValidUrl = false;
  }

  setAutentication(checked: boolean) {
    this.botForm.patchValue({
      botAuthentication: checked
    });
    this.botForm.markAsDirty();
  }

  setStatus(checked: boolean) {
    this.botForm.patchValue({
      botStatus: checked
    });
    this.botForm.markAsDirty();
  }

  mouseleaveImageURL() {
    if ((this.botForm.get('botImage').dirty) && (this.botForm.get('botImage').status === 'INVALID')) {
       this.botImageSizeError = false;
       this.formErrorImageURL = true;
       this.botImagePatternError = true;
    } else {
      this.formErrorImageURL = false;
      this.botImagePatternError = false;
    }
  }

  mouseleaveTelephone() {
    if  ((this.botForm.get('botTelephoneNumber').dirty) && (this.botForm.get('botTelephoneNumber').status === 'INVALID')) {
      this.formErrorTelephone = true;
    } else{
      this.formErrorTelephone = false;
    }
  }
}
