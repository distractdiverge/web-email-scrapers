const {
    main,
    register,
    getCredentialsPathFromSettings,
    getTopicFromSettings,
    getLabelsFromSettings,
} = require('../index');

describe('gmail-parser.watcher main', () => {
    describe('main()', () => {

    });

    describe('register()', () => {

    });

    describe('getCredentialsPathFromSettings()', () => {
        describe('when given valid inputs', () => {
            it('should return the expected value', () => {
                const input = { 'credentials_path': 'aValue' };
                const output = getCredentialsPathFromSettings(input);
                expect(output).toBe('aValue');
            });
        });

        describe('when given undefined', () => {
            it('should return undefined', () => {
                const output = getCredentialsPathFromSettings(undefined);
                expect(output).toBe(undefined);
            });
        });
    });

    describe('getTopicFromSettings()', () => {
        describe('when given valid inputs', () => {
            it('should return the expected value', () => {
                const input = { 'pubsub_topic_name': 'aValue' };
                const output = getTopicFromSettings(input);
                expect(output).toBe('aValue');
            });
        });
    });

    describe('getLabelsFromSettings()', () => {
        describe('when given valid inputs', () => {
            it('should return the expected value', () => {
                const input = { 'label_names': 'aValue' };
                const output = getLabelsFromSettings(input);
                expect(output).toBe('aValue');
            });
        });
    });
});