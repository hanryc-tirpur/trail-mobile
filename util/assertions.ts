

export function assertIsNotNull<T>(val: T): asserts val is NonNullable<T> {
  if (val === null) {
    throw Error(
      `Expected 'val' to be defined, but received ${val}`
    );
  }
}
