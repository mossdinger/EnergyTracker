export enum Mode {
    Eat = 'eat', 
    Exercise = 'exercise'
}

export enum Gender {
    Male = "male", 
    Female = "female",
}

export enum Level {
    Low = 1, 
    Medium = 2, 
    High = 3, 
}

export enum Cuisine {
    Healthy = "healthy", 
    Normal = "normal", 
    Junk = "junk", 
    Dessert = "dessert",
}

export type OptIntake = number; 

export type CurrentDate = string;
  
export interface Info {
    age: number;
    height: number; 
    weight: number; 
    gender: Gender; 
}
  
export interface PopulatedInfo extends Info {
    bmi: number; 
}
  
export interface Activity {
    mode: Mode; 
    energy: number;
    note: string; 
}
  
export interface PopulatedActivity extends Activity {
    date: string; 
    time: string;  
}
  
export interface SevenDays {
    [date: string]: {
        gain: number; 
        loss: number; 
        overall: number; 
    }
}

export interface Estimation {
    level: Level; 
}

export interface ExerciseEstimation extends Estimation {
    min: number; 
}

export interface EatEstimation extends Estimation {
    cuisine: Cuisine; 
}