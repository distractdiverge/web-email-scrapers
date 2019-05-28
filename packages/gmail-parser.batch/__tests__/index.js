const {
    main,
    promiseMap,
    getCredentialsPath,
    getParserLabels,
    getId,
    getMessageBody,
    extractIdsFromLabels,
} = require('../index');


describe('Batch Main File', () => {

    describe('getId()', () => {

        // TODO: Replace with 'Property Test'
        describe('with undefined input', () => {
            it('should return undefined', () => {
                expect(getId(undefined)).toBe(undefined);
            });
        });

        describe('with malformed input', () => {
            it('should return undefined', () => {
                expect(getId({'a': 'b'})).toBe(undefined);
            });
        });

        describe('with valid input', () => {
            it('should return a valid value', () => {
                expect(getId({'id': 'value'})).toBe('value');
            });
        });
    });

});