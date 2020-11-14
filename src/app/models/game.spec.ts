import { Game } from './game';

describe('Game', () => {
  it('should create an instance', () => {
    expect(new Game(
      undefined,
      10,
      10,
      2
    )).toBeTruthy();

    describe('all hidden cells are mines', () => {
      it('should error out', () => { });
    });
  });
});
