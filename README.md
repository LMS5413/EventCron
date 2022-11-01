# EVENT CRON - A MODULE FOR MANAGER YOUR EVENTS

Event cron - a module for manager your events using node-cron!

# Installation

NPM


```bash
npm install eventcron
```

YARN

```bash
yarn add eventcron
```

# USAGE

```js
const eventcron = require('eventcron');

(new cron.EventCron({events: [{endIn: "01/11/2022", name: "test", startIn: "31/10/2022"}], timezone: "America/SaoPau"})).start().then(res => {
    res.on("eventEnded", (event) => {
        console.log(`Event ${event.name} is ended with index ${events.index}`)
    })
    res.on("eventStarted", (event) => {
        console.log(`Event ${event.name} is started with index ${events.index}`)
    })
})
```

# PARAMS

```js
{
    events: [{
        endIn:, //Time from event is ended Format date: DD/MM/YYYY)
        endStarted:, //Time from event is ended Format date: DD/MM/YYYY)
        name: //Name of events
    }],
    pattern:, //Node cron pattern (Default: 0 0 * * *)
    timezone: //Timezone from locale (Opcional)
} //Promise<EventEmitter>
```

# EVENTS

```
"eventStarted" - If event is started (Result: {name: string, index: number}) 
"eventEnded" - If event is ended (Result: {name: string, index: number})
```

# EVENT RETURN PROPERTIES

```
name: string - Name of event
index: number - Index of event array.
```
