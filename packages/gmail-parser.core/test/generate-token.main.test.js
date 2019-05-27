const generateToken = require('../generate-token.main');

describe('getCredentials()', () => {
    describe('when given undefined input', () => {
        it('should return undefined', () => {
            const output = generateToken.getCredentialsPath(undefined);
            expect(output).toBe(undefined);
        });
    });

    describe('when given malformed input', () => {
        it('should return undefined', () => {
            const input = { 'wrong-prop': 'aValue' };
            const output = generateToken.getCredentialsPath(input);
            expect(output).toBe(undefined);
        });
    });

    describe('when given valid input', () => {
        it('should return valid output', () => {
            const input = { 'credentials_path': 'aValue' };
            const output = generateToken.getCredentialsPath(input);
            expect(output).toBe('aValue');
        });
    });
});

module.exports = {};