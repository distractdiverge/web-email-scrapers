const settings = require('../settings');

describe('Batch Settings', () => {

    describe('getGoogleConfig', () => {
        let config;

        beforeAll(() => {
            config = settings.getGoogleConfig();
        });

        it('should return \'.credentials.json\' by default for credentials_path', () => {
            expect(config).toHaveProperty('credentials_path');
            expect(config.credentials_path.length).toBeGreaterThan(0);
            expect(config.credentials_path).toMatch(/.*\.json$/);
        });

    });

    describe('getParserConfig', () => {

        let config;

        beforeAll(() => {
            config = settings.getParserConfig();
        });

        it('should return [\'INBOX\', \'to-process\'] by default for label_names', () => {
            expect(config).toHaveProperty('label_names');
            expect(config.label_names).toBeInstanceOf(Array);
            expect(config.label_names.length).toBeGreaterThan(0);
        });

    });
});