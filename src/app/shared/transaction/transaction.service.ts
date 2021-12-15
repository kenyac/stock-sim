import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaction } from './transaction.model';

const BACKEND_URL = environment.apiUrl + "/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

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
    return this.http.get<Transaction[]>(BACKEND_URL);
  }
}
