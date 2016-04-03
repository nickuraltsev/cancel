import 'should';
import sinon from 'sinon';
import 'should-sinon';
import Cancellation, { CancellationError } from '../src';

describe('Cancellation', () => {
  let cancellation;

  beforeEach(() => {
    cancellation = new Cancellation();
  });

  describe('#cancel', () => {
    it('notifies listeners', () => {
      const listener = sinon.spy();
      cancellation.onCancel(listener);
      listener.should.not.be.called();
      cancellation.cancel();
      listener.should.be.calledOnce();
    });

    it('can be called multiple times', () => {
      cancellation.cancel();
      cancellation.cancel();
    });
  });

  describe('#isCanceled', () => {
    it('returns false if cancellation has not been requested', () => {
      cancellation.isCanceled().should.be.false();
    });

    it('returns true if cancellation has been requested', () => {
      cancellation.cancel();
      cancellation.isCanceled().should.be.true();
    });
  });

  describe('#throwIfCanceled', () => {
    it('does not throw if cancellation has not been requested', () => {
      (() => cancellation.throwIfCanceled()).should.not.throw();
    });

    it('throws if cancellation has been requested', () => {
      cancellation.cancel();
      (() => cancellation.throwIfCanceled()).should.throwError(CancellationError);
    });
  });

  describe('#onCancel', () => {
    it('can be called after cancellation is requested', () => {
      cancellation.cancel();
      cancellation.onCancel(() => {});
    });
  });

  describe('unsubscribe function', () => {
    it('removes listener', () => {
      const listener = sinon.spy();
      const removeListener = cancellation.onCancel(listener);
      removeListener();
      cancellation.cancel();
      listener.should.not.be.called();
    });

    it('can be called multiple times', () => {
      const removeListener = cancellation.onCancel(() => {});
      removeListener();
      removeListener();
    });

    it('can be called after cancellation is requested', () => {
      const removeListener = cancellation.onCancel(() => {});
      cancellation.cancel();
      removeListener();
    });
  });
});
