import { TitleCasePipe } from './titlecase.pipe';

describe('TitleCasePipe', () => {
    let pipe: TitleCasePipe;
    beforeEach(() => {
        pipe = new TitleCasePipe();
    });
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('transforms "nilesh" to "Nilesh"', () => {
        expect(pipe.transform('nilesh')).toBe('Nilesh');
    });
    it('transforms "NILESH" to "Nilesh"', () => {
        expect(pipe.transform('NILESH')).toBe('Nilesh');
    });
});
