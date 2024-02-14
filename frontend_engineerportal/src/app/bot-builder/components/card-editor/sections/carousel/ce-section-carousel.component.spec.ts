import { Component, Input } from '@angular/core';
import { CECarouselSectionComponent } from './ce-section-carousel.component';
import { TestBed, inject } from '@angular/core/testing';
import { CompilerFactory, Compiler } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkerBotService } from '../../../../../worker-bot/services/worker-bot.service';
import { ConversationService } from '../../../../services/conversation.service';
import { UtilService } from '../../../../../services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, Validators, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { ServiceAPIs } from '../../../../../core/services/service-apis.service';
import { ToastrService } from 'ngx-toastr';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'converse-button',
  template: '',
})

export class ButtonMockComponent {
  @Input() val;
  @Input() rounded;
  @Input() boolGreen;

}

describe('CE carousel Component', function () {
  let fixture;
  let component;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      declarations: [CECarouselSectionComponent,
          ButtonMockComponent,
      ],
      providers: []
    });

    fixture = TestBed.createComponent(CECarouselSectionComponent);
    component = fixture.componentInstance;
  });


  it('Component to be defined', async () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should add image', async () => {
    fixture.detectChanges();
    component.imgTitle = "test_title"
    component.imgUrl = "test_url";
    component.imageData = [];
    component.addImage();
    expect(component.imageData.length).toEqual(1);
  });

  it('should remove image', async () => {
    component.botIconErrorHandler();
    component.imageData = ["profiel_pic"];
    component.removeImg("profiel_pic");
    expect(component.imageData.length).toEqual(0);
  });
});