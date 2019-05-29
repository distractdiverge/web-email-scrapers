const {
    makeRequestOptions,
    makeFilename,
    getStatusCode,
    handleDownloadError,
    downloadFile,
    downloadFiles,
} = require('../download.service');

describe('download.service', () => {
    describe('makeRequestOptions()', () => {
        const input = 'http://a.url';
        let output;

        beforeAll(() => {
            output = makeRequestOptions(input);
        });

        it('should have the correct method', () => {
           expect(output).toHaveProperty('method', 'GET');
        });

        it('should have the correct encoding', () => {
            expect(output).toHaveProperty('encoding', null);
        });

        it('should have the correct content-type', () => {
            expect(output).toHaveProperty('headers.Content-Type', 'image/png');
        });

        it('should have the correct uri', () => {
            expect(output).toHaveProperty('uri', input);
        });
    });

    describe('makeFilename()', () => {
        it('should make a filename', () => {
            const output = makeFilename(() => 1);
            expect(output).toBe('out_1.png');
        });
    });

    describe('getStatusCode()', () => {
        it('should return the statusCode', () => {
            const input = { response: { statusCode: 1} };
            const output = getStatusCode(input);
            expect(output).toBe(1);
        });
    });

    describe('handleDownloadError()', () => {
        describe('when denied access', () => {
           it('should call logError with access denied error', () => {
               const mockLog = jest.fn();
               const url = 'https://an.url';
               handleDownloadError(mockLog, url, { response: { statusCode: 401 } });

               expect(mockLog).toBeCalledWith(`Could not download ${url}: Permission Denied`);
           });
        });

        describe('when given generic error', () => {
            it('should call logError with general message and message', () => {
                const mockLog = jest.fn();
                const url = 'https://an.url';
                handleDownloadError(mockLog, url, { message: 'General Error' });

                expect(mockLog).toBeCalledWith(`Could not download ${url}: General Error`);
            });
        });

        describe('when given generic error with no message', () => {
            it('should call logError with general message', () => {
                const mockLog = jest.fn();
                const url = 'https://an.url';
                const output = handleDownloadError(mockLog, url, undefined);

                expect(mockLog).toBeCalledWith(`Could not download ${url}: Unknown Error`);
            });
        });
    });
});