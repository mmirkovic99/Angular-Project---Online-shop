import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateLogin() {
    this.router.navigate(['auth/login']);
  }

  navigateRegistration() {
    this.router.navigate(['auth/registration']);
  }

  navigateCart() {
    this.router.navigate(['/cart']);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
}
