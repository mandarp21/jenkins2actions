import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Application Dependency module
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { FileSaverModule, FileSaverService } from 'ngx-filesaver';
// Application Modules
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard';

import { AppService } from './services/app.service';
import { UtilService } from './services/util.service';

import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import { AppRoutingModule } from './app-routing.module';
import { MasterBotModule } from './master-bot';
import { WorkerBotModule } from './worker-bot';
import { LoginModule } from './login';
import { RegisterModule } from './register';

// Application global service
import { ServiceAPIs } from './core/services/service-apis.service';
import { BotBuilderModule } from './bot-builder/bot-builder.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { ImportService } from './services/import.service';
import { ExportService } from './services/export.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
    LoginModule,
    RegisterModule,
    DashboardModule,
    MasterBotModule,
    WorkerBotModule,
    BotBuilderModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }), // ToastrModule added
    NgxSmartModalModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    FileSaverModule
  ],
  providers: [ServiceAPIs, AppService, UtilService, AuthService, AuthGuard, CookieService, NgxSmartModalService, ImportService, ExportService, FileSaverService],
  bootstrap: [AppComponent]
})
export class AppModule {}
