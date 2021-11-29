import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/transaction";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  makeTransaction(){
    /* const data = {
      transaction: "BUY",
      type: "SECURITY",
      name: "AAPL",
      volume: 10,
      pricePer: 160.24,
      amount: 1602.4
    }
    this.http.post(BACKEND_URL, data)
      .subscribe(
        response => {
          console.log(response);
        }
      ) */
  }

  getTransactions(){
    this.http.get(BACKEND_URL)
      .subscribe(
        d => {
        console.log(d);
      });
  }
}
