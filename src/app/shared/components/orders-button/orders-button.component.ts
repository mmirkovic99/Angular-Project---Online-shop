import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'orders-button',
  templateUrl: './orders-button.component.html',
  styleUrls: ['./orders-button.component.scss'],
})
export class OrdersButtonComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate() {
    this.router.navigate(['orders']);
  }
}
