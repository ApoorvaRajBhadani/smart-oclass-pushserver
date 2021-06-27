const express = require('express');
const webpush = require('web-push');

const publicVapidKey = "BPq4A4ShxxzqxjjmWyPW7hHwgi9ihdOyGegB87hhAg1OQjcSM1MKpQZKx4nRyTB_3T5oleuGyIUIA9RVuPxaABA";//process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = "B5D7HrcZtlnob8Age1rziulyJK-sIMEP8gFDa8RH1OQ";//process.env.PRIVATE_VAPID_KEY;

// Replace with your email
webpush.setVapidDetails('mailto:apoorva222g@gmail.com', publicVapidKey, privateVapidKey);

const app = express();
app.use(require('body-parser').json());
app.use(express.static("public"));

//for testing purpose
var alltokens = [];

//for testing purpose
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    console.log(subscription);
    alltokens.push(subscription);
});

//for testing purpose
app.get('/triggerall',function(req,res){
    for(var i=0;i<alltokens.length;i++){
        const subscription = alltokens[i];
        const payload = JSON.stringify({ title: 'test' });
        webpush.sendNotification(subscription, payload).catch(error => {
            console.error(error.stack);
        });
    }
    res.send("{endpoint: 'https://fcm.googleapis.com/fcm/send/dbuBtvGPzZ0:APA91bF5Pt0SukpfAWl5EjTookyDSvVMzBOYER8fk60KiEzFb2NT0VAgYq4yhPMXp_dTNqtl3tx0rl1ZQCEj7qRuWi6QqsMRj6HMYYOcd0Ixs706XdKu0We0flSkADj_xWib0n6p_OK3',expirationTime: null,keys: {p256dh: 'BFHr9Asj0YVyEfkmTwZB-_yLbML-syqbhVfWSEF5hrldn3am0wc8wGsPEKmP9J7m5B9nhZYkA4oCn2EoOAOqdv8',auth: 'HQQvEAQXX7wdgY1cZbFnKQ'}}");
});

app.post('/trigger',function(req,res){
    const arr = req.body.students;
    for(var i=0;i<arr.length;i++){
        const endpoint = arr[i].token1;
        const p256dh = arr[i].token2;
        const auth = arr[i].token3;
        const subscription = {
            endpoint: endpoint,
            expirationTime: null,
            keys: {
                p256dh: p256dh,
                auth: auth
            }
        }
        console.log("Triggering "+i);
        console.log(subscription);
        const payload = JSON.stringify({ title: 'test' });
        webpush.sendNotification(subscription, payload).catch(error => {
            console.error(error.stack);
        });
    }
    var stat = {
        status: "ok"
    }
    res.send(stat);
});

app.listen(3000,function(){
  console.log("Server started at port 3000");
});