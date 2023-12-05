import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, inject, effect, AfterViewChecked } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
  ],
})
export class LayoutComponent implements OnDestroy, AfterViewInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  showSpinner: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;

  private autoLogoutSubscription: Subscription = new Subscription();

  private router = inject(Router);

  private authService = inject(AuthService);

  user = this.authService.user;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.autoLogoutSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
