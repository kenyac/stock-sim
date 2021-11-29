import { AfterViewInit, Component, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { interval, animationFrameScheduler, observable, from, EMPTY, of, merge, Observable, concat } from 'rxjs';
import { timestamp, map, takeWhile, tap, concatAll, take, startWith, scan, mapTo, delay, timeInterval, mergeAll } from 'rxjs/operators';
import { Bar } from './bar.model';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, AfterViewInit {

  @ViewChildren('rect') rects!: QueryList<SVGRectElement>;
  @ViewChildren('line') lines!: QueryList<SVGLineElement>;

  svgDims: Record<string, string> = {};
  numBars: number = 6;
  gutter: number = 5;
  svgW: number = 150;
  svgH: number = 150;
  bars:Bar[] = [];
  
  //enum this
  colors: string[] = [
    '#ae3c60',
    '#df473c',
    '#f3c33c',
    '#255e79',
    '#267778',
    '#82b4bb'
  ];

  requestAnimationFrame$ = interval(0, animationFrameScheduler)
                           .pipe(
                              map(x => animationFrameScheduler.now())
                            );

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
      this.setSVGDims();
      const barW: number = (this.svgW - this.gutter * (this.numBars + 1))/this.numBars;
      for (let i = 0; i < this.numBars; i++){
        const randomH = Math.random()*this.svgH;
        let tempObj = {
          x: (this.gutter*(i+1))+barW*i,
          y: randomH,
          width: barW,
          height: this.svgH - randomH,
          fill: this.colors[i]};
        this.bars.push(tempObj);

      }
      //console.log(this.bars); 
      //this.test();
  }

  ngAfterViewInit(){
    console.log(Array.from(this.bars, b => b.height));
    //this.rects.forEach(rect => console.log(rect.nativeElement.getAttribute('height')));
    //this.animate(this.rects, 'y', 500);
    //console.log(Array.from(this.bars, b => b.height));
    let obs1$ = this.test2(this.lines, ['x2', 'y2'], 125, [[0,150],[150,0]]);
    let obs2$ = this.test(this.rects, 'y', 550, Array.from(this.bars, b => b.height), true);
    this.queue([obs1$, obs2$]);
  }

  setSVGDims() {
    this.svgDims = {
      'height': this.svgH.toString() + 'px',
      'width': this.svgW.toString() + 'px'
    };
  }

  test(target: QueryList<any>, property: string, duration: number, values: number[], async: boolean = false) {
    const timing = async? concatAll: mergeAll;
    let i: number = 0;
    let sum = values.reduce((p,c) => p + c);
    const obs$ = from(target.toArray())
    const higherOrder$ = obs$.pipe(
      map((o) => {
        let h = values[i];
        let d = duration * (h / sum);
        console.log(d);
        let increment = h / d;
        i++;
        return this.dur(d).pipe(
        map((t) => {
          this.renderer.setAttribute(o.nativeElement, property, (150 - increment * t).toString());
          return (150 - increment * t).toString();
        }));
      }
      )
    );
    
    const firstOrder = higherOrder$.pipe(timing());
    
    return firstOrder;

  } 

  test2(target: QueryList<any>, property: string[], duration: number, values: number[][], async: boolean = false) {
    const timing = async? concatAll: mergeAll;
    let i: number = 0;
    const obs$ = from(target.toArray())
    const higherOrder$ = obs$.pipe(
      map((o) => {
        let s = values[0][i];
        let v = values[1][i];
        let increment = (v - s) / duration;
        console.log(increment);
        let p = property[i];
        i++;
        return this.dur(duration).pipe(
        map((t) => {
          this.renderer.setAttribute(o.nativeElement, p, (s + increment * t).toString());
          return (increment * t).toString();
        }));
      }
      )
    );
    
    const firstOrder = higherOrder$.pipe(timing());
    
    return firstOrder;
  }

  dur(d: number) {
    return this.requestAnimationFrame$.pipe(
      timeInterval(),
      map(x => x.interval),
      scan((t,n) => t === d ? t + 1 : Math.min(t + n, d),0),
      takeWhile(t => t <= d)
    );
  }

  queue(obs$: Observable<any>[]){
    const higherOrder = from(obs$);
    const firstOrder = higherOrder.pipe(concatAll());
    firstOrder.subscribe()
  }
}
