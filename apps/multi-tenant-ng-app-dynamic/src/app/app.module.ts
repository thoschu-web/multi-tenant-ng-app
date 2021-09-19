import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from "@angular/router";

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { TenantModule } from '@multi-tenant-ng-app/tenant';
import { SayHelloModule } from '@multi-tenant-ng-app/say-hello';
import { NavigationModule } from '@multi-tenant-ng-app/navigation';

import { AppComponent } from './app.component';
import { AppInterceptor } from './app.interceptor';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, HttpClientModule, RouterModule,
    KeycloakAngularModule,
    SayHelloModule, TenantModule,
    NavigationModule.forRoot('Tom S.')
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloak: KeycloakService): () => void => {
        return (): void => {
          keycloak
            .init({
              config: {
                url: `${environment.keycloak}/auth`,
                realm: 'baufi24',
                clientId: 'ng-dynamic'
              },
              initOptions: {
                onLoad: 'login-required',
                flow: 'implicit'
              }
            })
            .then((res: boolean) => console.log(`KeycloakInit: ${res}`))
            .then(() => {
              console.log(keycloak.getKeycloakInstance().idTokenParsed);
            })
            .catch((err: Error) => console.error(`Error KeycloakInit: ${err}`));
        }
      },
      multi: true,
      deps: [KeycloakService]
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AppInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log(`${environment.keycloak}/auth`);
  }
}
