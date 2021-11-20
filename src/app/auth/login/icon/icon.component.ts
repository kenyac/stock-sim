import { AfterViewInit, Component, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { interval, animationFrameScheduler, observable, from, EMPTY, of } from 'rxjs';
import { timestamp, map, takeWhile, tap, concatAll, take, startWith, scan, mapTo, delay, timeInterval, mergeAll } from 'rxjs/operators';
import { Bar } from './bar.model';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, AfterViewInit {

  @ViewChildren('rect') rects!: QueryList<any>;

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
    //console.log(this.rects);
    //this.rects.forEach(rect => console.log(rect.nativeElement.getAttribute('height')));
    //this.animate(this.rects, 'y', 500);
    //console.log(Array.from(this.bars, b => b.height));
    this.test(this.rects, 'y', 550, Array.from(this.bars, b => b.height));
  }

  setSVGDims() {
    this.svgDims = {
      'height': this.svgH.toString() + 'px',
      'width': this.svgW.toString() + 'px'
    };
  }

  animate(target: QueryList<any>, property: string, duration: number){
    target.forEach(o => {
      let h = o.nativeElement.getAttribute('height');
      let start = o.nativeElement.getAttribute(property)
      let increment = h / duration;
      //console.log(o, increment);
      this.dur(duration).subscribe(t => {
        this.renderer.setAttribute(o.nativeElement, property, (150 - increment * t).toString())
      });
    });   
  }

  test(target: QueryList<any>, property: string, duration: number, values: number[]) {
    console.log(target.toArray());
    let i: number = 0;
    let sum = values.reduce((p,c) => p + c);
    const obs$ = from(target.toArray())
    const higherOrder$ = obs$.pipe(
      map((o) => {
        let h = values[i];
        let d = duration * (h / sum);
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
    
    const firstOrder = higherOrder$.pipe(concatAll());
    firstOrder.subscribe(x => console.log(x));
    

  } 

  dur(d: number) {
    return this.requestAnimationFrame$.pipe(
      timeInterval(),
      map(x => x.interval),
      scan((t,n) => t === d ? t + 1 : Math.min(t + n, d)),
      takeWhile(t => t <= d)
    );
  }
}
