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
const { EventCron } = require('eventcron');
(async () => {
    const eventStarter = new EventCron({events: [{name: "event1", startIn: "02/11/2022:3:05", endIn: "02/11/2022:3:06"}]})
    const initEvent = await eventStarter.start()
})
```
# EventCron Class Params

```js
events: [{name: "Name your event", startIn: "date/hour start event (hour opcional)", endIn: "date/hour end event (hour opcional)"}],
pattern: "pattern node cron (Default value: 0 0 * * * (Every midnight))" //ATTENCION! If propriety of event startIn or endIn includes hours change pattern to */1 * * * *
timezone: "Your timezone (Default value: Timezone from Server)"
```
# Return

```js
name: string //Name of event,
index: number //Index of array