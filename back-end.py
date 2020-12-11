from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING, DESCENDING

app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb+srv://testuser:test123@cluster0.yehjj.mongodb.net/<dbname>?retryWrites=true&w=majority")
db =  client.final

@app.route('/setInfo', endpoint='setinfo')
def setinfo():
  try:
    gender = str(request.args.get('gender'))
    age = int(request.args.get('age'))
    weight = int(request.args.get('weight'))
    height = int(request.args.get('height'))
    bmi = weight/((height/100)**2)
    date = str(datetime.now().date())
    time = str(datetime.now().time())
    db.info.drop() 
    db.info.insert_one({"gender": gender,
                   "age": age,
                   "weight": weight,
                   "height": height,
                   "bmi": bmi
                  })
    return "<h1>Completed</h1>"
  except:
    return '<h3>An Error Occurred</h3>'

@app.route('/getInfo', endpoint='getinfo')
def getinfo():
  try:
    userinfo = db.info.find({})[0]
    del userinfo['_id']
    return jsonify(userinfo)
  except:
    return '<h3>An Error Occurred</h3>'

@app.route('/addAct', endpoint='addact')
def addact():
  try:
    mode = str(request.args.get('mode'))
    energy = int(request.args.get('energy'))
    note = str(request.args.get('note'))
    date = str(datetime.now().date())
    time = str(datetime.now().time())
    print("Date", date)
    print("Time", time)
    db.activity.insert_one({"date": date,
                   "time": ":".join(time.split(":")[:3])[0:8],
                   "mode": mode,
                   "energy": energy,
                   "note": note
                  })
    return "<h1>Completed</h1>"
  except:
    return '<h3>An Error Occurred</h3>'

@app.route('/getAct', endpoint='getact')
def getact():
  try: 
    activityall = list(db.activity.find(sort=[("date", DESCENDING), ("time", DESCENDING)]))
    for act in activityall:
      act.pop("_id")
    return jsonify(activityall)
  except:
    return '<h3>An Error Occurred</h3>'

@app.route('/get7Days', endpoint='get7days')
def get7days():
  try:
    act7 = list(db.activity.find({"date": { "$gt": str(datetime.now().date() - timedelta(days=7)) }}, sort=[("date", ASCENDING)]))
    result = []
    for act in act7:
      act.pop("_id")
    for i in range(0,7):
      day = -1 * i
      current = str(datetime.now().date() - timedelta(days=i))
      result.append({'gain': 0,
                     'loss': 0,
                     'overall': 0
                    })
      for act in act7:
        if (act['date'] == current):
          if (act['mode'] == 'eat'):
            result[i]['gain'] += act['energy']
          elif (act['mode'] == 'exercise'):
            result[i]['loss'] += act['energy']
          result[i]['overall'] = result[i]['gain'] - result[i]['loss']
    return jsonify({ "days": result[::-1] })
  except:
    return '<h3>An Error Occurred</h3>'

@app.route('/getOpt', endpoint='getopt')
def getopt():
    info = db.info.find({})[0]
    if (info['gender'] == 'male'):
      if (info['age'] >= 31):
        rmr = (info['weight'] * 11.6) + 879
      else:
        rmr = (info['weight'] * 15.3) + 679
    else:
      if (info['age'] >= 31):
        rmr = (info['weight'] * 8.7) + 829
      else:
        rmr = (info['weight'] * 14.7) + 496
    return str(rmr * 1.5)

@app.route('/estEx', endpoint='estex')
def estex():
  info = db.info.find({})[0]
  level = int(request.args.get('level'))
  min = int(request.args.get('min'))
  if (level == 1):
    base = 560
  elif (level == 2):
    base = 880
  elif (level == 3):
    base = 1300
  if (info['bmi'] < 12):
    energy = str(int(0.5 * base * min / 60))
  elif (info['bmi'] > 32):
    energy = str(int(1.5 * base * min / 60))
  else:*
    energy =  str(int((((info['bmi'] - 22) / 20) + 1) * base * min / 60))
  return energy

@app.route('/estEat', endpoint='esteat')
def esteat():
  info = db.info.find({})[0]
  level = int(request.args.get('level'))
  cuisine = str(request.args.get('cuisine'))
  if (cuisine == "healthy"):
    base = 115
  elif (cuisine == "normal"):
    base = 600
  elif (cuisine == "junk"):
    base = 1500
  elif (cuisine == "dessert"):
    base = 260

  if (info['bmi'] < 12):
    energy = str(int(0.5 * base * level / 2))
  elif (info['weight'] > 32):
    energy = str(int(1.5 * base * level / 2))
  else:
    energy =  str(int((((info['bmi'] - 22) / 20) + 1) * base * level / 2))
  return energy

@app.route('/getRecent', endpoint='getrecent')
def getrecent():
  try: 
    activityall = list(db.activity.find(sort=[("date", DESCENDING), ("time", DESCENDING)], limit=1))
    for act in activityall:
      act.pop("_id")
    return jsonify(activityall)
  except:
    return '<h3>An Error Occurred</h3>'

@app.route('/getDate', endpoint='getdate')
def getdate():
  try:
    rn = datetime.now().date()
    return rn.strftime("%d/%m/%Y")
  except:
    return '<h3>An Error Occurred</h3>'

app.run()
