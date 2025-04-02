/**
 * Mock Date object để tests có thể chạy với một fixed date
 * @param fixedDate Date cố định cho tests
 */
const RealDate = global.Date

export function mockDate(fixedDate: Date = new Date("2023-01-01T00:00:00Z")): void {
  const OriginalDate = global.Date

  // @ts-ignore
  global.Date = class extends OriginalDate {
    constructor(...args: any[]) {
      if (args.length === 0) {
        return new OriginalDate(fixedDate)
      }
      // @ts-ignore
      return new OriginalDate(...args)
    }

    static now() {
      return new OriginalDate(fixedDate).getTime()
    }
  }
}

/**
 * Reset Date object về trạng thái ban đầu
 */
export function resetDate(): void {
  // @ts-ignore
  global.Date = RealDate
}

