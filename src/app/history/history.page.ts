import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { PopulatedActivity } from '../main.type';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  public activities: PopulatedActivity[] = [];

  constructor(public service: MainService) { }

  ngOnInit() {
    this.service.getActivities().subscribe(activities => {
      this.activities = activities;
    });
  }

}
