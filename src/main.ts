import { cloneDeep } from 'lodash-es';

(function() {

enum Status {
  RuntimeError = 'runtime-error',
  Success = 'success',
  PresentationError = 'presentation-error',
  WrongAnswer = 'wrong-answer'
}

interface TestlibConfig {
  secret: string;
  targetOrigin: string;
  test: unknown;
}

interface SendResultParams<T = unknown> {
  status: Status;
  payload: T;
}

interface Testlib {
  config: TestlibConfig;
  test: unknown;
  status: {
    runtimeError: Status.RuntimeError,
    success: Status.Success,
    presentationError: Status.PresentationError,
    wrongAnswer: Status.WrongAnswer
  };
  sendResult: (params: SendResultParams) => void;
}

function createTestlib(config: TestlibConfig): Testlib {
  var testlib: Testlib = {
    config,
    test: () => cloneDeep(config.test),
    status: {
      runtimeError: Status.RuntimeError,
      success: Status.Success,
      presentationError: Status.PresentationError,
      wrongAnswer: Status.WrongAnswer
    },
    sendResult({status, payload}: SendResultParams): void {
      window.parent.postMessage({ status, payload, secret: (this as Testlib).config.secret }, (this as Testlib).config.targetOrigin);
    }
  }  
  return testlib;
}

Object.defineProperty(window, Symbol.for('testlib-factory'), { value: createTestlib });
})();
