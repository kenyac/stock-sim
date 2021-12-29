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
  axes: any = {};
  maxY: number = 0;
  minY: number = Number.MAX_SAFE_INTEGER;
  line!: string;

  constructor(private transactionService: TransactionService,
              private alphaVantageService: AlphaVantageService) { }

  ngOnInit(): void {
    this.setSVGDims();
    this.transactionService.getTransactions().subscribe({
      next: d => {
        this.transactions = d;
      },
      complete: () => {
        this.alphaVantageService.getData('TIME_SERIES_INTRADAY', 'AAPL', '1min').subscribe({
          next: d => {
            this.timeSeries['AAPL'] = d["Time Series (1min)"];
          },
          complete: () => {
            console.log(this.timeSeries['AAPL']);
            console.log(this.transactions);
            const innerSvgW = this.svgW - this.marginLeft;
            for(const key in this.timeSeries['AAPL']){
              for(let i = 0; i < this.transactions.length; i++){
                if(this.transactions[i].name === 'AAPL'){
                  let totalProfit = 0;
                  if(key > this.transactions[i].date.toString()){
                    totalProfit = this.transactions[i].volume * this.timeSeries['AAPL'][key]['4. close'];
                    if (key in this.axes){
                      this.minY = (this.minY > (this.axes[key] + totalProfit))? this.axes[key] + totalProfit: this.minY;
                      this.maxY = (this.maxY < (this.axes[key] + totalProfit))? this.axes[key] + totalProfit: this.maxY;
                    }
                    else {
                      this.minY = (this.minY > totalProfit)? totalProfit: this.minY;
                      this.maxY = (this.maxY < totalProfit)? totalProfit: this.maxY;
                    }
                    (key in this.axes) ? this.axes[key] += totalProfit : this.axes[key] = totalProfit;                    
                  }
                }
              }
            }
            this.drawValue(this.minY, this.maxY, Object.entries(this.axes).sort())
          }
        });
      }
    })    
  }

  setSVGDims() {
    this.svgDims = {
      'height': this.svgH.toString() + 'px',
      'width': this.svgW.toString() + 'px'
    };
  }

  drawValue(min: number, max: number, axes: any[][]){
    console.log(min, max);
    console.log(axes);
    console.log(axes[0][1])
    let getH = (y: number) => (this.svgH - this.marginBottom) * ((y - min) / (max - min));
    let increment = this.svgW / axes.length;
    console.log(increment);
    this.line = "M" + this.marginLeft + "," + getH(axes[0][1]);
    for(let i = 1; i < axes.length; i++){
      this.line += 'L' + (this.marginLeft + (increment * i)) + ',' + getH(axes[i][1]);
    }
  }

}
