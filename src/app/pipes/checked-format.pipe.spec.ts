import { CheckedFormatPipe } from './checked-format.pipe';

describe('CheckedFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckedFormatPipe();
    expect(pipe).toBeTruthy();
  });

  it('should check if a flag to true returns the correct value', () => {
    const pipe = new CheckedFormatPipe();
    const result = pipe.transform(true);
    expect(result).toBe('Enabled');
  });

  it('should check if a flag to false returns the correct value', () => {
    const pipe = new CheckedFormatPipe();
    const result = pipe.transform(false);
    expect(result).toBe('Not enabled');
  });
});
