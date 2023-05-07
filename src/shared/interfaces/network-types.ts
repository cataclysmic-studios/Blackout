interface ServerResponseOk<T> {
  success: true;
  data?: T;
}

interface ServerResponseBad {
  success: false;
  error: string;
}

export type ServerResponse<T = void> = ServerResponseOk<T> | ServerResponseBad;
