import { Component } from '@angular/core';
import { MainService } from '../main.service';
import { PopulatedActivity } from '../main.type';
import { Chart, ChartDataSets} from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  constructor(public service: MainService) {}
  public activities: PopulatedActivity[] = [];
  public date: String;

  ionViewDidEnter() {
    const canvas = document.getElementById('graph') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    this.service.getDate().subscribe(currentDate => {
      this.date = currentDate;
    })

    this.service.getRecent().subscribe(activities => {
      this.activities = activities;
    });


    this.service.get7Days().subscribe((days) => {
      this.service.getOptIntake().subscribe(data => {
        const rec: number[] = [];
        for (var i = 0; i < 7; i++) {
          rec.push(data);
        }
        const keys = Object.keys(days);
        const gain = keys.map(key => days[key].gain);
        const loss = keys.map(key => days[key].loss);
        const datasets: ChartDataSets[] = [{
          label: "Outtakes", 
          data: loss, 
          backgroundColor: [
            'rgba(129, 188, 248, 0.9)',
            'rgba(60, 153, 245, 0.9)',
            'rgba(11, 127, 243, 0.9)',
            'rgba(9, 102, 194, 0.9)',
            'rgba(6, 76, 146, 0.9)',
            'rgba(4, 51, 97, 0.9)',
            'rgba(2, 25, 48, 0.9)',
          ].reverse(), 
          borderColor: [
            '#468faf',
            '#2c7da0',
            '#2a6f97',
            '#014f86',
            '#01497c',
            '#013a63',  
            '#012a4a',
          ], 
        }, {
          label: "Net", 
          data: gain.map((val, i) => val - loss[i]), 
          backgroundColor: [
            'rgba(238, 103, 103, 0.9)',
            'rgba(233, 57, 57 , 0.9)',
            'rgba(215, 23, 23, 0.9)',
            'rgba(169, 18, 18, 0.9)',
            'rgba(123, 13, 13, 0.9)',
            'rgba(78, 8, 8, 0.9)',
            'rgba(32, 3, 3, 0.9)', 
          ].reverse(), 
          borderColor: [
            '#bd1f36',
            '#b21e35',
            '#a71e34',
            '#a11d33',
            '#85182a',
            '#6e1423', 
            '#641220',
          ]
        }, {
          data: rec,
          label: "Recommended Intake",
          type: "line",
          backgroundColor: "#ffffff",
          borderColor: "#f48c06",
          pointBackgroundColor: "#f48c06"
        }
        ]
        
        new Chart(ctx, {
          type: 'bar', 
          data: {
            labels: ["","","","","","",""], 
            datasets, 
          }, 
          options: {
            layout: {
              padding: {
                top: 8,
                right: 0, 
                bottom: 0, 
                left: 0, 
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
  })
  }

}
