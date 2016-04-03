# cancel

Cooperative cancellation

## Installation

Install using [npm](https://www.npmjs.org/):

```
npm install cancel
```

## Example

```js
import Cancellation, { CancellationError } from 'cancel';

function sendRequest(method, url, body, cancellation) {
  if (cancellation.isCanceled()) {
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

    cancellation.onCancel(() => {
      request.abort();
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

#### .cancel()

Issues a cancellation request.

It is safe to call this method multiple times since all but the first call are ignored.

#### .isCanceled()

Returns `true` if cancellation has been requested; otherwise, returns `false`.

#### .onCancel(listener)

Adds a listener to be notified when cancellation is requested.

##### Parameters

* `listener` - A function to be called when cancellation is requested.

Returns a function that, when called, removes the listener.

#### .throwIfCanceled

Throws a `CancellationError` if cancellation has been requested.

### CancellationError

The error that is thrown when an operation is canceled.

#### new CancellationError([message])

Creates a new instance of `CancellationError`.

##### Parameters

* `message` - The error message.

##### Example

```js
throw new CancellationError('Operation has been canceled.');
```

## License

[MIT](https://github.com/nickuraltsev/cancel/blob/master/LICENSE)
