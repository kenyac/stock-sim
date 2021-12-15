import { Component, OnInit } from '@angular/core';
import { AlphaVantageService } from 'src/app/shared/alpha-vantage/alpha-vantage.service';
import { Transaction } from 'src/app/shared/transaction/transaction.model';
import { TransactionService } from 'src/app/shared/transaction/transaction.service';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  svgDims: Record<string, string> = {};
  transactions!: Transaction[];
  stroke = "black";
  marginLeft = 20;
  marginBottom = 30;
  marginAround = 40;
  svgH: number = 300;
  svgW: number = window.innerWidth - this.marginAround; 
  svgViewBox = "0,0," + this.svgW + "," + this.svgH;
  yTransform = "translate(" + this.marginLeft +",0)";
  xTransform = "translate(0," + (this.svgH - this.marginBottom) +")";
  xAxis = "M" + this.marginLeft + ",0H" + this.svgW;
  
  dateRange: string[] = [];
  timeSeries: any = {};
  roundTo: number = 1000*60;
  yVals: number[] = [];
  months: any = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
  };

  roundToMin = (x: number) => Math.floor(x / this.roundTo) * this.roundTo;

  constructor(private transactionService: TransactionService,
              private alphaVantageService: AlphaVantageService) { }

  ngOnInit(): void {
    this.setSVGDims();
    this.alphaVantageService.getData('TIME_SERIES_INTRADAY', 'AAPL', '1min').subscribe({
      next: d => {
        this.timeSeries['AAPL'] = d["Time Series (1min)"];
        this.dateRange = this.alphaVantageService.dateRange(this.timeSeries['AAPL']);
      },
      complete: () => {
        console.log(this.timeSeries['AAPL']);
        this.transactionService.getTransactions().subscribe({
          next: d => {
            this.transactions = d;
          },
          complete: () => {
            const innerSvgW = this.svgW - this.marginLeft;
          }
        });
      }
    });
    
  }

  setSVGDims() {
    this.svgDims = {
      'height': this.svgH.toString() + 'px',
      'width': this.svgW.toString() + 'px'
    };
  }

  convertDate(date: string) {
    let str: string[] = date.split(' ');
    let s = str[3] + '-' + this.months[str[1]] + '-' +str[2] + ' ' + str[4];
    return s;
  }

}
