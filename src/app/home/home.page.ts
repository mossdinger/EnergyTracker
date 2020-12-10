import { Component } from '@angular/core';
import { MainService } from '../main.service';
import { Chart, ChartDataSets} from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public service: MainService) {}

  ionViewDidEnter() {
    const canvas = document.getElementById('graph') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    this.service.get7Days().subscribe((days) => {
      const keys = Object.keys(days);
      const gain = keys.map(key => days[key].gain);
      const loss = keys.map(key => days[key].loss);

      const datasets: ChartDataSets[] = [{
        label: "Outtakes", 
        data: loss, 
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)', 
          'rgba(255, 99, 132, 0.6)',
        ], 
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)', 
          'rgba(255, 99, 132, 1)',
        ], 
      }, {
        label: "Net", 
        data: gain.map((val, i) => val - loss[i]), 
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ], 
        borderColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)', 
          'rgba(255, 99, 132, 0.8)',
        ]
      }]
      
      new Chart(ctx, {
        type: 'horizontalBar', 
        data: {
          labels: keys, 
          datasets, 
        }, 
        options: {
          layout: {
            padding: {
              top: 8,
              right: 8, 
              bottom: 8, 
              left: 8, 
            }
          },
          legend: {
            display: false
          }, 
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }
      })
    });
  }

}
