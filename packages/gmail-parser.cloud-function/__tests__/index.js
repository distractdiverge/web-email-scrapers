const {
    getMessageData,
    decodeFromBase64,
    subscribe,
} = require('../index');
const fastCheck = require('fast-check');

describe('Cloud Function Entrypoint', () => {

    describe('getMessageData()', () => {

        describe('when given valid input', () => {
            it('should return the expected value', () => {
                const input = { 'data': 'aValue' };
                const output =  getMessageData(input);

                expect(output).toBe('aValue');
            });
        });

        describe('when given undefined input', () => {
            it('should return undefined', () => {
                const output = getMessageData(undefined);
                expect(output).toBe(undefined);
            });
        });
    });

    describe('decodeFromBase64()', () => {
        describe('when given undefined', () => {
            it('should return undefined', () => {
                const output = decodeFromBase64(undefined);
                expect(output).toBe(undefined);
            });
        });

        describe('when given malformed input', () => {
            it('should return garbage', () => {
                const input = Buffer.from('notBase64').toString('utf8');
                const output = decodeFromBase64(input);
                expect(output).toBe('��AjǺ');
            });
        });

        describe('when given valid base64 input', () => {
            it('should return the decoded input', () => {
                //const input = Buffer('aValue').toString('base64');
                //const output = decodeFromBase64(input);
                //expect(output).toBe('aValue');

                fastCheck.assert(
                    fastCheck.property(
                        fastCheck.string(),
                        (input) => {
                            const encodedInput = Buffer.from(input).toString('base64');
                            expect(decodeFromBase64(encodedInput)).toBe(input);
                        }
                    )
                );
            });
        });
    });

    describe('subscribe()', () => {
        describe('when given a valid event', () => {
           it('should call the callback', () => {

               const event = { data: 'aValue' };
               const callback = jest.fn();

               subscribe(event, callback);

               expect(callback).toBeCalled();
           });
        });
    });

});