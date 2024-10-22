import { Component, importProvidersFrom, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // Importer CommonModule
import { FormsModule } from '@angular/forms';  // Importér FormsModule for ngModel
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, CommonModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'credit-card-frontend';

  private apiUrl = 'http://localhost:3000'

  http = inject(HttpClient);

  getPosts() {
    return this.http.get(`${this.apiUrl}/transactions`);
  }

  getPost(id: number){
    return this.http.get(this.apiUrl+'/'+id);
  }
}

