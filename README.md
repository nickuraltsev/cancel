# cancel

[![npm version](https://badge.fury.io/js/cancel.svg)](https://badge.fury.io/js/cancel)
[![Build Status](https://api.travis-ci.org/nickuraltsev/cancel.svg?branch=master)](https://travis-ci.org/nickuraltsev/cancel)

Cooperative cancellation

## Installation

Install using [npm](https://www.npmjs.org/):

```
npm install cancel
```

## Example

```js
import Cancellation, { CancellationError } from 'cancel';

// This is an example of a simple HTTP client that supports cancellation
function sendRequest(method, url, body, cancellation) {
  // Check if cancellation has already been requested
  if (cancellation.isCanceled()) {
    // Reject with `CancellationError` so that the caller can distinguish between cancellation and failure
    return Promise.reject(new CancellationError('Request has been canceled.'));
  };

  return new Promise(function executor(resolve, reject) {
    const request = new XMLHttpRequest();
    request.open(method, url, true);

    request.onload = () => resolve({
      status: request.status,
      body: request.response,
    });

    request.onerror = () => reject(new Error('A network error has occurred.'));

    // Add a listener that will be called when cancellation is requested
    cancellation.onCancel(() => {
      // Abort the HTTP request
      request.abort();
      // Reject with `CancellationError` so that the caller can distinguish between cancellation and failure
      reject(new CancellationError('Request has been canceled.'));
    });

    request.send(body);
  });
}

const cancellation = new Cancellation();

sendRequest('GET', 'https://api.github.com/users/nickuraltsev/starred', null, cancellation)
  .then(response => console.log(`Response status: ${response.status}`))
  .catch(error => {
    if (error instanceof CancellationError) {
      console.log('Request canceled');
    } else {
      console.log('Network failure');
    }
  });

// ...

cancellation.cancel(); 
```

## API

### Cancellation

#### new Cancellation()

Creates a new `Cancellation` object.

#### Instance methods

##### cancel()

Issues a cancellation request.

It is safe to call this method multiple times since all but the first call are ignored.

##### isCanceled()

Returns `true` if cancellation has been requested; otherwise, returns `false`.

##### onCancel(listener)

Adds a listener to be notified when cancellation is requested.

###### Parameters

* `listener` - A function to be called when cancellation is requested.

Returns a function that, when called, removes the listener.

##### throwIfCanceled()

Throws a `CancellationError` if cancellation has been requested.

##### fork()

Creates a child `Cancellation` object that will be canceled when the parent object is canceled.

### CancellationError

The error that is thrown when an operation is canceled.

#### new CancellationError([message])

Creates a new instance of `CancellationError`.

##### Parameters

* `message` - The error message.

## License

[MIT](https://github.com/nickuraltsev/cancel/blob/master/LICENSE)
