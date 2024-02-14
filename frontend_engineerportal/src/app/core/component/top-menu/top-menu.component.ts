import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'top-menu',
  styleUrls: ['top-menu.component.sass'],
  templateUrl: 'top-menu.component.html'
})

/**
 * @internal
 * This class is a reusable component to make a top page header.
 * In this component the input params are:
 * companylogo:string - it gives the path of company logo image, which comes as a parameter from the local assets folder
 * avatarlogo:string - it gives the path of avatar image, which comes as a parameter from the login api
 * username:string - it gives the name of the user who is currently logged in, will be populated when a user has logged in
 * fixHeader:boolean - this property determines the styling of the header depending on the logged in status of user
 * hideFixedHeader:boolean - this property determines if the header is visible or not, typically when no user is logged in * the header is not visible.
 * This component gives out the  event - eventClick when user clicks on the logout button.
 *
 */
export class TopMenuComponent implements OnInit {
  @Input()
  companylogo: string;
  @Input()
  avatarlogo: string;
  @Input()
  username: string;
  @Input()
  fixHeader: boolean;
  @Input()
  hideFixedHeader: boolean;
  @Output()
  eventClick = new EventEmitter();
  isDialogueDesignerPage: boolean;

  /**
   * @internal
   * This is the constructor of the class. It initialises the following to default values:
   *
   * companylogo:string - path of company logo image in the local assets folder
   * avatarlogo:string -  path of avatar image in the assets folder
   * username:string - it gives the name of the user who is currently logged in, will be populated when a user has logged in
   *
   */

  constructor(private router: Router) {
    this.companylogo = 'assets/img/Converse_Logo_White.svg';
    this.avatarlogo = 'assets/img/Bot_Avatar.png';
    this.username = '';
    this.isDialogueDesignerPage = false;
  }

  /**
   * @internal
   * This is a method called when user clicks on 'Logout" text. It emits a event with value 'logout'
   *
   */
  logout() {
    this.eventClick.emit('logout');
  }

  navigateHome() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * @internal
   * This is a Angular lifecycle method ngOnInit
   *
   */
  ngOnInit() {
    this.router.events.subscribe(val => {
      this.isDialogueDesignerPage = val instanceof NavigationEnd && val.url.toLowerCase().indexOf('conversation/view') > -1 ? true : false;
    });
  }
}
