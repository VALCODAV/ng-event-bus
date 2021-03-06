import {v4 as uuid} from 'uuid';
import {NgEventBus} from '../src/ng_event_bus';

describe('NgEventBus works as expected', () => {

    const generateMessages = () => {
        return {
            ch1: uuid(),
            ch2: uuid(),
            ch3: uuid(),
            ch4: uuid(),
            ch5: uuid(),
            ch6: uuid(),
            ch7: uuid(),
            ch8: uuid(),
            ch9: uuid(),
        };
    };

    it('Submit to channel', () => {

        let eventBus = new NgEventBus();
        let channelMessages = generateMessages();

        //subscribe to message
        Object.keys(channelMessages).forEach((channel) => {
            eventBus.on(channel).subscribe((data) => {
                expect(data).toEqual(channelMessages[channel]);
            });
        });


        //cast something
        Object.keys(channelMessages).forEach((channel) => {
            eventBus.cast(channel, channelMessages[channel]);
        });


    });

    const matchPairs = [
        ['a', 'a'],
        ['a:b', 'a:b'],
        ['a:b:c', 'a:b:c'],
        ['a:b:c', '**'],
        ['a:b:c', 'a:**'],
        ['a:b:c', 'a:b:*'],
        ['a:b:c', 'a:b:**'],
        ['a:b:c', '*:b:*'],
        ['a:b:c', 'a:*:*'],
    ];

    const dontMatchPairs = [
        ['a', 'b'],
        ['a:b:c', 'a:*'],
        ['a:b:c', 'a:b'],
        ['a:b:c', 'a:b:c:**'],
        ['a:b:c', 'b:c:*'],
        ['a:b:c', 'c'],
        ['a:b:c', 'b'],
        ['a:b:c', 'a:b:c:d'],
    ];

    it('keyMatch works as expected', () => {

        let eventBus = new NgEventBus();

        matchPairs.forEach((pair) => {
            let cast = pair[0];
            let wild = pair[1];
            expect(eventBus.keyMatch(cast, wild)).toEqual(true);
        });

        dontMatchPairs.forEach((pair) => {
            let cast = pair[0];
            let wild = pair[1];
            expect(eventBus.keyMatch(cast, wild)).toEqual(false);
        });
    });

    it('Submit to wildcard', () => {
        let eventBus = new NgEventBus();
        let values = {};

        matchPairs.forEach((pair) => {
            let cast = pair[0];
            let wild = pair[1];
            values[cast] = uuid();

            eventBus.cast(cast, values[cast]);
            eventBus.on(wild).subscribe((receivedValue) => {
                expect(receivedValue).toEqual(values[cast]);
            });
        });
    });

});
