import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: ` <div style="text-align:center; margin:32px 0">
    <h2>404 - Not Found</h2>
    <a class="btn" [routerLink]="['/']">Go Home</a>
  </div>`,
})
export class NotFoundComponent {}
