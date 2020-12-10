import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Gender, PopulatedInfo } from '../main.type';

interface InfoField {
  age: string;
  weight: string; 
  height: string; 
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public changeMade = false;  
  public info: PopulatedInfo;
  public infoField: InfoField = {
    age: "", 
    weight: "", 
    height: "", 
  };

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service
      .getInfo()
      .subscribe(info => {
        this.info = info;
        this.infoField = {
          age: info.age.toString(), 
          weight: info.weight.toString(), 
          height: info.height.toString(),
        }
      });
  }

  genderChanged(ev: Gender) {
    this.info.gender = ev; 
    this.changeMade = true; 
  }

  fieldChanged(field: keyof InfoField, value: string) {
    this.infoField[field] = value;
    
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      this.info[field] = parsedValue; 
      this.changeMade = true; 
    }
  }

  submit() {
    this.service.setInfo(this.info).subscribe(() => {
      this.service.getInfo().subscribe((info) => this.info.bmi = info.bmi);
      this.changeMade = false; 
    });
    
  }

}
