import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from './auth/auth.service';
import { UtilService } from './services/util.service';
import { ToastrService } from 'ngx-toastr';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  // Top Header Dummy data
  converselogo: string;
  userlogo: string;
  usrName: string;
  fixHeader: boolean;
  isLoggedIn$: Observable<boolean>;
  logginSubscription: Subscription;
  logoutSubscription: Subscription;
  onTimeout : Subscription;
  onTimeoutWarning : Subscription;
  onPing : Subscription;
  confirmToExtendSession: boolean;

  environment: 'DEV' | 'TEST' | 'MOCK' | 'PROD';

  constructor(private authService: AuthService, private router: Router, private utilService: UtilService,
              private toasterService: ToastrService, private idle: Idle, private keepalive: Keepalive) {
    this.converselogo = 'assets/img/Converse_Logo_White.svg';
    this.userlogo = 'assets/img/Bot_Avatar.png';
    this.usrName = 'Chloe';
    this.environment = 'DEV';
    this.confirmToExtendSession = false;

    // sets an idle timeout of 300 seconds, for testing purposes.
    this.idle.setIdle(300);
    // sets a timeout period of 1500 seconds. after 1500 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(1500);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // sets the ping interval to 30 seconds
    this.keepalive.interval(30);
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.loggedIn$;
    this.logginSubscription = this.isLoggedIn$.subscribe(response => {
      if (response) {
        this.startWatching();
        this.usrName = this.utilService.getAdminFirstName();
      }
    });
    // On each page load to validate auth token
    this.router.events.subscribe((navigation: any) => {
      if (navigation instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;

    if (scrollPosition >= 68) {
      this.fixHeader = true;
    } else {
      this.fixHeader = false;
    }
  }

  startWatching() {
    console.log('---- Start Watching-----');
    this.idleWatchUnsubscribe();
    // logout the user
    this.onTimeout = this.idle.onTimeout.subscribe(() => {
      this.idleWatchUnsubscribe();
      this.confirmToExtendSession = false;
      this.logout();
    });

    // timeout warning
    this.onTimeoutWarning = this.idle.onTimeoutWarning.subscribe((countdown) => {
      console.log('----- TW-----', countdown);
      if (countdown <= 300 && !this.confirmToExtendSession) {
        this.askToUser();
      }
    });

    this.onPing = this.keepalive.onPing.subscribe(() => {
      console.log('--- ping ---', new Date());
      this.validateAuthToken();
    });

    this.idle.watch();
  }

  /**
   * @description To validate auth token
   */
  async validateAuthToken(extend: boolean = false) {
    // To validate auth token on every ping
    this.authService.validateAuthentication({token: this.utilService.getAuthToken()}, extend).subscribe(
      (response: any) => {
        return 'OK';
      },
      (error: HttpErrorResponse) => {
        if ([400, 401, 503].indexOf(error.status) !== -1) {
          this.logout();
        }
      }
    );
  }

  /**
   * @description To unsubscribe idle watch subscriptions
   */
  idleWatchUnsubscribe(): void {
    console.log('---- Unsubscribe Idle Watch Subscription-----');
    if (this.onTimeout) {
      this.onTimeout.unsubscribe();
    }
    if (this.onTimeoutWarning) {
      this.onTimeoutWarning.unsubscribe();
    }
    if (this.onPing) {
      this.onPing.unsubscribe();
    }
  }
  /**
   * @description To logout admin from the admin portal
   */
  logout(): void {

    this.idleWatchUnsubscribe();
    this.logoutSubscription = this.authService
      .logoutAdmin({
        adminToken: this.utilService.getAuthToken()
      })
      .subscribe(
        response => {
          // delete cookies && notify login subscribers
          this.utilService.deleteAuthCookies();
          this.authService.isLoggedIn();
          this.router.navigate(['/login']);
        },
        error => {
          console.log('======== Error Response ======');
          // delete cookies && notify login subscribers
          this.utilService.deleteAuthCookies();
          this.authService.isLoggedIn();
          // log error && redirect to login
          this.router.navigate(['/login']);
        }
      );
  }

  /**
   * @description - Method - To confirm to extend session
   */
  askToUser(): void {
    this.confirmToExtendSession = true;
  }

  /**
   * @description - Method - To handle user selection
   * @returns - void
   */
  async handleConfirmEvent(confirmToExtendSession: boolean) {
    this.confirmToExtendSession = false;
    if (confirmToExtendSession) {
      await this.validateAuthToken(confirmToExtendSession);
      this.idle.watch();
    } else {
      this.logout();
    }
  }

  ngOnDestroy(): void {
    if (this.logginSubscription) {
      this.logginSubscription.unsubscribe();
    }

    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }

    this.idleWatchUnsubscribe();
  }
}
