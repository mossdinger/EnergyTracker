import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Activity, Cuisine, EatEstimation, ExerciseEstimation, Level, Mode } from '../main.type';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
  public successNotice = false; 
  public energyField = "";
  public minField = "";
  public levelField = "1";
  
  public estimation: {
    exercise: ExerciseEstimation, 
    eat: EatEstimation,
  } = {
    exercise: { 
      level: Level.Low, 
      min: 0,
    }, 
    eat: {
      level: Level.Low, 
      cuisine: Cuisine.Normal
    }
  }
  
  public activity: Activity = {
    mode: Mode.Eat, 
    energy: 0, 
    note: ""
  }

  constructor(public service: MainService) { }

  ngOnInit() {
  }

  activitySubmitted() {
    this.service.addActivity(this.activity).subscribe(() => {
      this.successNotice = true; 
      setTimeout(() => {
        this.successNotice = false; 
      }, 1000)
    });
  }

  segmentChanged(ev: Mode) {
    this.activity.mode = ev;
  }

  energyChanged(ev: string) {
    this.energyField = ev;
    
    const parsedEnergy = parseFloat(ev);
    if (!Number.isNaN(parsedEnergy)) {
      this.activity.energy = parsedEnergy;
    }
  }

  noteChanged(ev: string) {
    this.activity.note = ev; 
  }

  levelChanged(ev: string) {
    this.levelField = ev; 
    this.estimation[this.activity.mode].level = parseInt(ev) as Level;
  }

  cuisineChanged(ev: Cuisine) {
    this.estimation.eat.cuisine = ev;
  }

  minChanged(ev: string) {
    this.minField = ev;

    const parsedMin = parseFloat(ev);
    if (!Number.isNaN(parsedMin)) {
      this.estimation.exercise.min = parsedMin;
    }
  }

  estimate() {
    console.log('clicked')
    if (this.activity.mode === Mode.Eat) {
      this.service
        .estimateEat(this.estimation.eat)
        .subscribe(value => {
          this.energyField = value.toString();
          this.activity.energy = value;
        });
    } else if (this.activity.mode === Mode.Exercise) {
      this.service
        .estimateExercise(this.estimation.exercise)
        .subscribe(value => {
          this.energyField = value.toString();
          this.activity.energy = value;
        });
    }
  }

}
