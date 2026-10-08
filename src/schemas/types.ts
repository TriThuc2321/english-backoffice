import type * as yup from 'yup';

export type InferFormInput<S> =
  S extends yup.ObjectSchema<infer TIn> ? TIn : never;
