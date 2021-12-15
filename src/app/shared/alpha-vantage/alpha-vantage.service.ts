import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

const API_KEY = '2928YCWTYND7EYT6';

@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {

  constructor(private http: HttpClient) { }

  getData(fn: string, equity: string, interval: string){
    const uri = 'https://www.alphavantage.co/query?function=' + 
                fn + 
                '&symbol=' +
                equity + 
                '&interval=' +
                interval +
                '&apikey=' +
                API_KEY;
    console.log(uri);

    return this.http.get<any>(uri);
  }

  dateRange(timeSeries: any) {
    return Object.keys(timeSeries);
  }
}
