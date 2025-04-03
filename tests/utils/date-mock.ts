/**
 * Mock Date object để tests có thể chạy với một fixed date
 * @param fixedDate Date cố định cho tests
 */
const RealDate = global.Date;

export function mockDate(fixedDate: Date = new Date('2023-01-01T00:00:00Z')): void {
  const OriginalDate = global.Date;

  class MockDate extends OriginalDate {
    constructor(...args: ConstructorParameters<typeof Date>) {
      if (!args.length) {
        super(fixedDate);
        return this;
      }
      super(...args);
      return this;
    }

    static now(): number {
      return new OriginalDate(fixedDate).getTime();
    }
  }

  global.Date = MockDate as DateConstructor;
}

/**
 * Reset Date object về trạng thái ban đầu
 */
export function resetDate(): void {
  global.Date = RealDate;
}
