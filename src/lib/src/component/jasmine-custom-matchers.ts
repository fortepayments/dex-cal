export let customDateMatchers: jasmine.CustomMatcherFactories = {
    toBeTheSameDate: function (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>):
        jasmine.CustomMatcher {

        return {
            compare: function (actual: Date, expected: Date): jasmine.CustomMatcherResult {
                let result: jasmine.CustomMatcherResult = {
                    pass: false,
                    message: ''
                };

                if (!actual) {
                    result.pass = false;
                    result.message = 'Actual is undefined';
                }

                if (!expected) {
                    result.pass = false;
                    result.message = 'Expected is undefined';
                }

                const actualDay = actual.getDate();
                const actualMonth = actual.getMonth();
                const actualYear = actual.getFullYear();

                const expectedDay = expected.getDate();
                const expectedMonth = expected.getMonth();
                const expectedYear = expected.getFullYear();

                result.pass = (actualDay === expectedDay) && (actualMonth === expectedMonth) && (actualYear === expectedYear);

                result.message = result.pass ? `Expected date matches actual date` :
                    `Expected date ${expected} did not match actual date ${actual}`;

                return result;
            }
        };
    }
};

