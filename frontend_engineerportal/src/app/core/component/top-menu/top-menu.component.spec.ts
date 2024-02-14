import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { TopMenuComponent } from './top-menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component : TopMenu', () => {
  let component: TopMenuComponent;
  let fixture: ComponentFixture<TopMenuComponent>;
  let welcElem: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule],
      declarations: [TopMenuComponent]
    });
    fixture = TestBed.createComponent(TopMenuComponent);
    component = fixture.componentInstance;
    component.username = 'Latisha'
  });

  it('TopMenuComponent should be defined', () => {
    expect(component).toBeDefined();
  });

  it('Component @Input companylogo should be set', () => {
    expect(component.companylogo).toEqual('assets/img/Converse_Logo_White.svg');
  });

  it('Component @Input avatarlogo should be set', () => {
    expect(component.avatarlogo).toEqual('assets/img/Bot_Avatar.png');
  });

  it('Component @Input username should be set', () => {
    expect(component.username).toEqual('Latisha');
  });

  it('If username is blank welcome text should be Welcome back', () => {
    component.username = '';
    welcElem = fixture.debugElement.query(By.css('span'));
    fixture.detectChanges();
    expect(welcElem.nativeElement.textContent.trim()).toEqual('Welcome back,');
  });

  it('Component welcome element should contain', () => {
    welcElem = fixture.debugElement.query(By.css('span'));
    fixture.detectChanges();
    expect(welcElem.nativeElement.textContent.trim()).toEqual('Welcome back, ' + component.username);
  });
});