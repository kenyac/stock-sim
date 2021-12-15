import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/transaction";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }
}
