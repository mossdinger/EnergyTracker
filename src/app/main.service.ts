import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Activity, EatEstimation, ExerciseEstimation, Info, OptIntake, PopulatedActivity, PopulatedInfo, SevenDays } from './main.type';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private url = "http://75effcbc61ef.ngrok.io";

  constructor(
    private http: HttpClient, 
  ) { }

  setInfo(info: Info): Observable<string> {
    const options = { responseType: 'text' as 'text' };
    const query = `
      gender=${info.gender}&
      age=${info.age}&
      weight=${info.weight}&
      height=${info.height}
    `.replace(/\s/g, "");

    return this.http.get(`${this.url}/setInfo?${query}`, options);
  }

  getInfo(): Observable<PopulatedInfo> {
    return this.http.get<PopulatedInfo>(`${this.url}/getInfo`);
  }

  addActivity(a: Activity): Observable<string> {
    const options = { responseType: 'text' as 'text' };
    const query = `
      mode=${a.mode}&
      energy=${a.energy}&
      note=${a.note}
    `.replace(/\s/g, "");

    return this.http.get(`${this.url}/addAct?${query}`, options);
  }

  getActivities(): Observable<PopulatedActivity[]> {
    return this.http.get<PopulatedActivity[]>(`${this.url}/getAct`); 
  }

  getRecent(): Observable<PopulatedActivity[]> {
    return this.http.get<PopulatedActivity[]>(`${this.url}/getRecent`); 
  }

  get7Days(): Observable<SevenDays> {
    return this.http.get<{ days: SevenDays }>(`${this.url}/get7Days`).pipe(
      map((response) => response.days)
    ); 
  }

  getOptIntake(): Observable<OptIntake> {
    const options = { responseType: 'text' as 'text' };

    return this.http.get(`${this.url}/getOpt`, options).pipe(
      map(response => parseInt(response) as OptIntake)
    );
  }

  estimateEat(ee: EatEstimation): Observable<number> {
    const options = { responseType: 'text' as 'text' };
    const query = `
      level=${ee.level}&
      cuisine=${ee.cuisine}
    `.replace(/\s/g, "");

    return this.http.get(`${this.url}/estEat?${query}`, options).pipe(
      map(response => parseInt(response))
    );
  }

  estimateExercise(ee: ExerciseEstimation): Observable<number> {
    const options = { responseType: 'text' as 'text' };
    const query = `
      level=${ee.level}&
      min=${ee.min}
    `.replace(/\s/g, "");

    return this.http.get(`${this.url}/estEx?${query}`, options).pipe(
      map(response => parseInt(response))
    );
  }
}
