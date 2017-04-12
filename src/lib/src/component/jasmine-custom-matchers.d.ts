declare module jasmine {
	interface Matchers {
		toBeTheSameDate(expected: Date): boolean;
	}
}