import assert from 'assert';

const regex = /^[A-Z]\d{5}$/;

export class ApplicationError extends Error {
  constructor(code: string, message: string, meta?: Record<string, never>) {
    super(message);

    assert(regex.test(code), 'Invalid error code format.');

    Object.assign(this, {
      ...(meta || {}),
      code,
    });
  }
}
