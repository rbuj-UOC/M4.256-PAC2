import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../app.selectors';
import { logout } from '../../Auth/actions';

@Component({
  selector: 'app-header',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store);

  showAuthSection: boolean;
  showNoAuthSection: boolean;
  userId$: any;

  constructor() {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.userId$ = this.store.select(selectUserId);
  }

  ngOnInit(): void {
    this.userId$.subscribe((userId) => {
      const showAuthSection = userId !== null;
      this.showAuthSection = showAuthSection;
      this.showNoAuthSection = !showAuthSection;
    });
  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}
