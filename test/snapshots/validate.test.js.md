# Snapshot report for `test/validate.test.js`

The actual snapshot is saved in `validate.test.js.snap`.

Generated by [AVA](https://avajs.dev).

## error

> Snapshot 1

    StructError {
      branch: [
        {
          foo: 'bar',
        },
        'bar',
      ],
      failures: Function {},
      key: 'foo',
      path: [
        'foo',
      ],
      refinement: undefined,
      type: 'never',
      value: 'bar',
      message: 'At path: foo -- Expected a value of type `never` for `foo`, but received: `"bar"`',
    }

## promise

> Snapshot 1

    StructError {
      branch: [
        {
          host: 0,
          port: '0',
        },
        0,
      ],
      failures: Function {},
      key: 'host',
      path: [
        'host',
      ],
      refinement: undefined,
      type: 'union',
      value: 0,
      message: 'At path: host -- Expected the value to satisfy a union of `any | string`, but received: 0',
    }

> Snapshot 2

    {
      error: undefined,
      value: {
        host: Promise {},
        port: Promise {},
      },
    }

> Snapshot 3

    {
      error: undefined,
      value: {
        host: {
          then: Function then {},
        },
        port: {
          then: Function then {},
        },
      },
    }

## throws

> Snapshot 1

    StructError {
      branch: [
        {
          batman: 'nanananana',
        },
        'nanananana',
      ],
      failures: Function {},
      key: 'batman',
      path: [
        'batman',
      ],
      refinement: undefined,
      type: 'never',
      value: 'nanananana',
      message: 'At path: batman -- Expected a value of type `never` for `batman`, but received: `"nanananana"`',
    }
