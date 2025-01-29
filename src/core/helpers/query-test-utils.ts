import { WritableSignal, signal } from '@angular/core';
import { CreateMutationResult, CreateQueryResult } from '@tanstack/angular-query-experimental';

/**
 * Return a tanstack query mock object
 * In a huge app, we would create a proper mock with all types required in CreateQueryResult
 * But for the sake of this example, we will just return a simple object
 */
export const getSuccessQueryMock = <T>(data: WritableSignal<T>) =>
  ({
    data: data,
    isLoading: signal(false),
    isSuccess: signal(true),
    isError: signal(false),
  }) as unknown as CreateQueryResult<T, Error>;

export const getMutationQueryMock = <T, K, O = void>() =>
  ({
    isSuccess: signal(true),
    isError: signal(false),
    mutate: (args: K) => {},
    mutateAsync: (args: K) => Promise.resolve(),
  }) as unknown as CreateMutationResult<T, Error, K, O>;
