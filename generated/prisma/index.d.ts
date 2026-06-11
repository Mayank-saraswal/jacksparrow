
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CorsairIntegration
 * 
 */
export type CorsairIntegration = $Result.DefaultSelection<Prisma.$CorsairIntegrationPayload>
/**
 * Model CorsairAccount
 * 
 */
export type CorsairAccount = $Result.DefaultSelection<Prisma.$CorsairAccountPayload>
/**
 * Model CorsairEntity
 * 
 */
export type CorsairEntity = $Result.DefaultSelection<Prisma.$CorsairEntityPayload>
/**
 * Model CorsairEvent
 * 
 */
export type CorsairEvent = $Result.DefaultSelection<Prisma.$CorsairEventPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CorsairIntegrations
 * const corsairIntegrations = await prisma.corsairIntegration.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more CorsairIntegrations
   * const corsairIntegrations = await prisma.corsairIntegration.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.corsairIntegration`: Exposes CRUD operations for the **CorsairIntegration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CorsairIntegrations
    * const corsairIntegrations = await prisma.corsairIntegration.findMany()
    * ```
    */
  get corsairIntegration(): Prisma.CorsairIntegrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.corsairAccount`: Exposes CRUD operations for the **CorsairAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CorsairAccounts
    * const corsairAccounts = await prisma.corsairAccount.findMany()
    * ```
    */
  get corsairAccount(): Prisma.CorsairAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.corsairEntity`: Exposes CRUD operations for the **CorsairEntity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CorsairEntities
    * const corsairEntities = await prisma.corsairEntity.findMany()
    * ```
    */
  get corsairEntity(): Prisma.CorsairEntityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.corsairEvent`: Exposes CRUD operations for the **CorsairEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CorsairEvents
    * const corsairEvents = await prisma.corsairEvent.findMany()
    * ```
    */
  get corsairEvent(): Prisma.CorsairEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CorsairIntegration: 'CorsairIntegration',
    CorsairAccount: 'CorsairAccount',
    CorsairEntity: 'CorsairEntity',
    CorsairEvent: 'CorsairEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "corsairIntegration" | "corsairAccount" | "corsairEntity" | "corsairEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CorsairIntegration: {
        payload: Prisma.$CorsairIntegrationPayload<ExtArgs>
        fields: Prisma.CorsairIntegrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CorsairIntegrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CorsairIntegrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>
          }
          findFirst: {
            args: Prisma.CorsairIntegrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CorsairIntegrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>
          }
          findMany: {
            args: Prisma.CorsairIntegrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>[]
          }
          create: {
            args: Prisma.CorsairIntegrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>
          }
          createMany: {
            args: Prisma.CorsairIntegrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CorsairIntegrationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>[]
          }
          delete: {
            args: Prisma.CorsairIntegrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>
          }
          update: {
            args: Prisma.CorsairIntegrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>
          }
          deleteMany: {
            args: Prisma.CorsairIntegrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CorsairIntegrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CorsairIntegrationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>[]
          }
          upsert: {
            args: Prisma.CorsairIntegrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairIntegrationPayload>
          }
          aggregate: {
            args: Prisma.CorsairIntegrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCorsairIntegration>
          }
          groupBy: {
            args: Prisma.CorsairIntegrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CorsairIntegrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CorsairIntegrationCountArgs<ExtArgs>
            result: $Utils.Optional<CorsairIntegrationCountAggregateOutputType> | number
          }
        }
      }
      CorsairAccount: {
        payload: Prisma.$CorsairAccountPayload<ExtArgs>
        fields: Prisma.CorsairAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CorsairAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CorsairAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>
          }
          findFirst: {
            args: Prisma.CorsairAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CorsairAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>
          }
          findMany: {
            args: Prisma.CorsairAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>[]
          }
          create: {
            args: Prisma.CorsairAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>
          }
          createMany: {
            args: Prisma.CorsairAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CorsairAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>[]
          }
          delete: {
            args: Prisma.CorsairAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>
          }
          update: {
            args: Prisma.CorsairAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>
          }
          deleteMany: {
            args: Prisma.CorsairAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CorsairAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CorsairAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>[]
          }
          upsert: {
            args: Prisma.CorsairAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairAccountPayload>
          }
          aggregate: {
            args: Prisma.CorsairAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCorsairAccount>
          }
          groupBy: {
            args: Prisma.CorsairAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<CorsairAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.CorsairAccountCountArgs<ExtArgs>
            result: $Utils.Optional<CorsairAccountCountAggregateOutputType> | number
          }
        }
      }
      CorsairEntity: {
        payload: Prisma.$CorsairEntityPayload<ExtArgs>
        fields: Prisma.CorsairEntityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CorsairEntityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CorsairEntityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>
          }
          findFirst: {
            args: Prisma.CorsairEntityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CorsairEntityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>
          }
          findMany: {
            args: Prisma.CorsairEntityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>[]
          }
          create: {
            args: Prisma.CorsairEntityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>
          }
          createMany: {
            args: Prisma.CorsairEntityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CorsairEntityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>[]
          }
          delete: {
            args: Prisma.CorsairEntityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>
          }
          update: {
            args: Prisma.CorsairEntityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>
          }
          deleteMany: {
            args: Prisma.CorsairEntityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CorsairEntityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CorsairEntityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>[]
          }
          upsert: {
            args: Prisma.CorsairEntityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEntityPayload>
          }
          aggregate: {
            args: Prisma.CorsairEntityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCorsairEntity>
          }
          groupBy: {
            args: Prisma.CorsairEntityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CorsairEntityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CorsairEntityCountArgs<ExtArgs>
            result: $Utils.Optional<CorsairEntityCountAggregateOutputType> | number
          }
        }
      }
      CorsairEvent: {
        payload: Prisma.$CorsairEventPayload<ExtArgs>
        fields: Prisma.CorsairEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CorsairEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CorsairEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>
          }
          findFirst: {
            args: Prisma.CorsairEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CorsairEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>
          }
          findMany: {
            args: Prisma.CorsairEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>[]
          }
          create: {
            args: Prisma.CorsairEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>
          }
          createMany: {
            args: Prisma.CorsairEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CorsairEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>[]
          }
          delete: {
            args: Prisma.CorsairEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>
          }
          update: {
            args: Prisma.CorsairEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>
          }
          deleteMany: {
            args: Prisma.CorsairEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CorsairEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CorsairEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>[]
          }
          upsert: {
            args: Prisma.CorsairEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorsairEventPayload>
          }
          aggregate: {
            args: Prisma.CorsairEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCorsairEvent>
          }
          groupBy: {
            args: Prisma.CorsairEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<CorsairEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.CorsairEventCountArgs<ExtArgs>
            result: $Utils.Optional<CorsairEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    corsairIntegration?: CorsairIntegrationOmit
    corsairAccount?: CorsairAccountOmit
    corsairEntity?: CorsairEntityOmit
    corsairEvent?: CorsairEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CorsairIntegrationCountOutputType
   */

  export type CorsairIntegrationCountOutputType = {
    accounts: number
  }

  export type CorsairIntegrationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | CorsairIntegrationCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * CorsairIntegrationCountOutputType without action
   */
  export type CorsairIntegrationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegrationCountOutputType
     */
    select?: CorsairIntegrationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CorsairIntegrationCountOutputType without action
   */
  export type CorsairIntegrationCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairAccountWhereInput
  }


  /**
   * Count Type CorsairAccountCountOutputType
   */

  export type CorsairAccountCountOutputType = {
    entities: number
    events: number
  }

  export type CorsairAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entities?: boolean | CorsairAccountCountOutputTypeCountEntitiesArgs
    events?: boolean | CorsairAccountCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * CorsairAccountCountOutputType without action
   */
  export type CorsairAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccountCountOutputType
     */
    select?: CorsairAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CorsairAccountCountOutputType without action
   */
  export type CorsairAccountCountOutputTypeCountEntitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairEntityWhereInput
  }

  /**
   * CorsairAccountCountOutputType without action
   */
  export type CorsairAccountCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CorsairIntegration
   */

  export type AggregateCorsairIntegration = {
    _count: CorsairIntegrationCountAggregateOutputType | null
    _min: CorsairIntegrationMinAggregateOutputType | null
    _max: CorsairIntegrationMaxAggregateOutputType | null
  }

  export type CorsairIntegrationMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    dek: string | null
  }

  export type CorsairIntegrationMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    dek: string | null
  }

  export type CorsairIntegrationCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    config: number
    dek: number
    _all: number
  }


  export type CorsairIntegrationMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    dek?: true
  }

  export type CorsairIntegrationMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    dek?: true
  }

  export type CorsairIntegrationCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    config?: true
    dek?: true
    _all?: true
  }

  export type CorsairIntegrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairIntegration to aggregate.
     */
    where?: CorsairIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairIntegrations to fetch.
     */
    orderBy?: CorsairIntegrationOrderByWithRelationInput | CorsairIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CorsairIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CorsairIntegrations
    **/
    _count?: true | CorsairIntegrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CorsairIntegrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CorsairIntegrationMaxAggregateInputType
  }

  export type GetCorsairIntegrationAggregateType<T extends CorsairIntegrationAggregateArgs> = {
        [P in keyof T & keyof AggregateCorsairIntegration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCorsairIntegration[P]>
      : GetScalarType<T[P], AggregateCorsairIntegration[P]>
  }




  export type CorsairIntegrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairIntegrationWhereInput
    orderBy?: CorsairIntegrationOrderByWithAggregationInput | CorsairIntegrationOrderByWithAggregationInput[]
    by: CorsairIntegrationScalarFieldEnum[] | CorsairIntegrationScalarFieldEnum
    having?: CorsairIntegrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CorsairIntegrationCountAggregateInputType | true
    _min?: CorsairIntegrationMinAggregateInputType
    _max?: CorsairIntegrationMaxAggregateInputType
  }

  export type CorsairIntegrationGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    config: JsonValue
    dek: string | null
    _count: CorsairIntegrationCountAggregateOutputType | null
    _min: CorsairIntegrationMinAggregateOutputType | null
    _max: CorsairIntegrationMaxAggregateOutputType | null
  }

  type GetCorsairIntegrationGroupByPayload<T extends CorsairIntegrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CorsairIntegrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CorsairIntegrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CorsairIntegrationGroupByOutputType[P]>
            : GetScalarType<T[P], CorsairIntegrationGroupByOutputType[P]>
        }
      >
    >


  export type CorsairIntegrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    config?: boolean
    dek?: boolean
    accounts?: boolean | CorsairIntegration$accountsArgs<ExtArgs>
    _count?: boolean | CorsairIntegrationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairIntegration"]>

  export type CorsairIntegrationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    config?: boolean
    dek?: boolean
  }, ExtArgs["result"]["corsairIntegration"]>

  export type CorsairIntegrationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    config?: boolean
    dek?: boolean
  }, ExtArgs["result"]["corsairIntegration"]>

  export type CorsairIntegrationSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    config?: boolean
    dek?: boolean
  }

  export type CorsairIntegrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "config" | "dek", ExtArgs["result"]["corsairIntegration"]>
  export type CorsairIntegrationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | CorsairIntegration$accountsArgs<ExtArgs>
    _count?: boolean | CorsairIntegrationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CorsairIntegrationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CorsairIntegrationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CorsairIntegrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CorsairIntegration"
    objects: {
      accounts: Prisma.$CorsairAccountPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string
      config: Prisma.JsonValue
      dek: string | null
    }, ExtArgs["result"]["corsairIntegration"]>
    composites: {}
  }

  type CorsairIntegrationGetPayload<S extends boolean | null | undefined | CorsairIntegrationDefaultArgs> = $Result.GetResult<Prisma.$CorsairIntegrationPayload, S>

  type CorsairIntegrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CorsairIntegrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CorsairIntegrationCountAggregateInputType | true
    }

  export interface CorsairIntegrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CorsairIntegration'], meta: { name: 'CorsairIntegration' } }
    /**
     * Find zero or one CorsairIntegration that matches the filter.
     * @param {CorsairIntegrationFindUniqueArgs} args - Arguments to find a CorsairIntegration
     * @example
     * // Get one CorsairIntegration
     * const corsairIntegration = await prisma.corsairIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CorsairIntegrationFindUniqueArgs>(args: SelectSubset<T, CorsairIntegrationFindUniqueArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CorsairIntegration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CorsairIntegrationFindUniqueOrThrowArgs} args - Arguments to find a CorsairIntegration
     * @example
     * // Get one CorsairIntegration
     * const corsairIntegration = await prisma.corsairIntegration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CorsairIntegrationFindUniqueOrThrowArgs>(args: SelectSubset<T, CorsairIntegrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationFindFirstArgs} args - Arguments to find a CorsairIntegration
     * @example
     * // Get one CorsairIntegration
     * const corsairIntegration = await prisma.corsairIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CorsairIntegrationFindFirstArgs>(args?: SelectSubset<T, CorsairIntegrationFindFirstArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairIntegration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationFindFirstOrThrowArgs} args - Arguments to find a CorsairIntegration
     * @example
     * // Get one CorsairIntegration
     * const corsairIntegration = await prisma.corsairIntegration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CorsairIntegrationFindFirstOrThrowArgs>(args?: SelectSubset<T, CorsairIntegrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CorsairIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CorsairIntegrations
     * const corsairIntegrations = await prisma.corsairIntegration.findMany()
     * 
     * // Get first 10 CorsairIntegrations
     * const corsairIntegrations = await prisma.corsairIntegration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const corsairIntegrationWithIdOnly = await prisma.corsairIntegration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CorsairIntegrationFindManyArgs>(args?: SelectSubset<T, CorsairIntegrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CorsairIntegration.
     * @param {CorsairIntegrationCreateArgs} args - Arguments to create a CorsairIntegration.
     * @example
     * // Create one CorsairIntegration
     * const CorsairIntegration = await prisma.corsairIntegration.create({
     *   data: {
     *     // ... data to create a CorsairIntegration
     *   }
     * })
     * 
     */
    create<T extends CorsairIntegrationCreateArgs>(args: SelectSubset<T, CorsairIntegrationCreateArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CorsairIntegrations.
     * @param {CorsairIntegrationCreateManyArgs} args - Arguments to create many CorsairIntegrations.
     * @example
     * // Create many CorsairIntegrations
     * const corsairIntegration = await prisma.corsairIntegration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CorsairIntegrationCreateManyArgs>(args?: SelectSubset<T, CorsairIntegrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CorsairIntegrations and returns the data saved in the database.
     * @param {CorsairIntegrationCreateManyAndReturnArgs} args - Arguments to create many CorsairIntegrations.
     * @example
     * // Create many CorsairIntegrations
     * const corsairIntegration = await prisma.corsairIntegration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CorsairIntegrations and only return the `id`
     * const corsairIntegrationWithIdOnly = await prisma.corsairIntegration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CorsairIntegrationCreateManyAndReturnArgs>(args?: SelectSubset<T, CorsairIntegrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CorsairIntegration.
     * @param {CorsairIntegrationDeleteArgs} args - Arguments to delete one CorsairIntegration.
     * @example
     * // Delete one CorsairIntegration
     * const CorsairIntegration = await prisma.corsairIntegration.delete({
     *   where: {
     *     // ... filter to delete one CorsairIntegration
     *   }
     * })
     * 
     */
    delete<T extends CorsairIntegrationDeleteArgs>(args: SelectSubset<T, CorsairIntegrationDeleteArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CorsairIntegration.
     * @param {CorsairIntegrationUpdateArgs} args - Arguments to update one CorsairIntegration.
     * @example
     * // Update one CorsairIntegration
     * const corsairIntegration = await prisma.corsairIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CorsairIntegrationUpdateArgs>(args: SelectSubset<T, CorsairIntegrationUpdateArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CorsairIntegrations.
     * @param {CorsairIntegrationDeleteManyArgs} args - Arguments to filter CorsairIntegrations to delete.
     * @example
     * // Delete a few CorsairIntegrations
     * const { count } = await prisma.corsairIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CorsairIntegrationDeleteManyArgs>(args?: SelectSubset<T, CorsairIntegrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CorsairIntegrations
     * const corsairIntegration = await prisma.corsairIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CorsairIntegrationUpdateManyArgs>(args: SelectSubset<T, CorsairIntegrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairIntegrations and returns the data updated in the database.
     * @param {CorsairIntegrationUpdateManyAndReturnArgs} args - Arguments to update many CorsairIntegrations.
     * @example
     * // Update many CorsairIntegrations
     * const corsairIntegration = await prisma.corsairIntegration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CorsairIntegrations and only return the `id`
     * const corsairIntegrationWithIdOnly = await prisma.corsairIntegration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CorsairIntegrationUpdateManyAndReturnArgs>(args: SelectSubset<T, CorsairIntegrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CorsairIntegration.
     * @param {CorsairIntegrationUpsertArgs} args - Arguments to update or create a CorsairIntegration.
     * @example
     * // Update or create a CorsairIntegration
     * const corsairIntegration = await prisma.corsairIntegration.upsert({
     *   create: {
     *     // ... data to create a CorsairIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CorsairIntegration we want to update
     *   }
     * })
     */
    upsert<T extends CorsairIntegrationUpsertArgs>(args: SelectSubset<T, CorsairIntegrationUpsertArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CorsairIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationCountArgs} args - Arguments to filter CorsairIntegrations to count.
     * @example
     * // Count the number of CorsairIntegrations
     * const count = await prisma.corsairIntegration.count({
     *   where: {
     *     // ... the filter for the CorsairIntegrations we want to count
     *   }
     * })
    **/
    count<T extends CorsairIntegrationCountArgs>(
      args?: Subset<T, CorsairIntegrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CorsairIntegrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CorsairIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CorsairIntegrationAggregateArgs>(args: Subset<T, CorsairIntegrationAggregateArgs>): Prisma.PrismaPromise<GetCorsairIntegrationAggregateType<T>>

    /**
     * Group by CorsairIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairIntegrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CorsairIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CorsairIntegrationGroupByArgs['orderBy'] }
        : { orderBy?: CorsairIntegrationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CorsairIntegrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorsairIntegrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CorsairIntegration model
   */
  readonly fields: CorsairIntegrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CorsairIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CorsairIntegrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends CorsairIntegration$accountsArgs<ExtArgs> = {}>(args?: Subset<T, CorsairIntegration$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CorsairIntegration model
   */
  interface CorsairIntegrationFieldRefs {
    readonly id: FieldRef<"CorsairIntegration", 'String'>
    readonly createdAt: FieldRef<"CorsairIntegration", 'DateTime'>
    readonly updatedAt: FieldRef<"CorsairIntegration", 'DateTime'>
    readonly name: FieldRef<"CorsairIntegration", 'String'>
    readonly config: FieldRef<"CorsairIntegration", 'Json'>
    readonly dek: FieldRef<"CorsairIntegration", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CorsairIntegration findUnique
   */
  export type CorsairIntegrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which CorsairIntegration to fetch.
     */
    where: CorsairIntegrationWhereUniqueInput
  }

  /**
   * CorsairIntegration findUniqueOrThrow
   */
  export type CorsairIntegrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which CorsairIntegration to fetch.
     */
    where: CorsairIntegrationWhereUniqueInput
  }

  /**
   * CorsairIntegration findFirst
   */
  export type CorsairIntegrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which CorsairIntegration to fetch.
     */
    where?: CorsairIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairIntegrations to fetch.
     */
    orderBy?: CorsairIntegrationOrderByWithRelationInput | CorsairIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairIntegrations.
     */
    cursor?: CorsairIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairIntegrations.
     */
    distinct?: CorsairIntegrationScalarFieldEnum | CorsairIntegrationScalarFieldEnum[]
  }

  /**
   * CorsairIntegration findFirstOrThrow
   */
  export type CorsairIntegrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which CorsairIntegration to fetch.
     */
    where?: CorsairIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairIntegrations to fetch.
     */
    orderBy?: CorsairIntegrationOrderByWithRelationInput | CorsairIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairIntegrations.
     */
    cursor?: CorsairIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairIntegrations.
     */
    distinct?: CorsairIntegrationScalarFieldEnum | CorsairIntegrationScalarFieldEnum[]
  }

  /**
   * CorsairIntegration findMany
   */
  export type CorsairIntegrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which CorsairIntegrations to fetch.
     */
    where?: CorsairIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairIntegrations to fetch.
     */
    orderBy?: CorsairIntegrationOrderByWithRelationInput | CorsairIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CorsairIntegrations.
     */
    cursor?: CorsairIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairIntegrations.
     */
    skip?: number
    distinct?: CorsairIntegrationScalarFieldEnum | CorsairIntegrationScalarFieldEnum[]
  }

  /**
   * CorsairIntegration create
   */
  export type CorsairIntegrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to create a CorsairIntegration.
     */
    data: XOR<CorsairIntegrationCreateInput, CorsairIntegrationUncheckedCreateInput>
  }

  /**
   * CorsairIntegration createMany
   */
  export type CorsairIntegrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CorsairIntegrations.
     */
    data: CorsairIntegrationCreateManyInput | CorsairIntegrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorsairIntegration createManyAndReturn
   */
  export type CorsairIntegrationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * The data used to create many CorsairIntegrations.
     */
    data: CorsairIntegrationCreateManyInput | CorsairIntegrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorsairIntegration update
   */
  export type CorsairIntegrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to update a CorsairIntegration.
     */
    data: XOR<CorsairIntegrationUpdateInput, CorsairIntegrationUncheckedUpdateInput>
    /**
     * Choose, which CorsairIntegration to update.
     */
    where: CorsairIntegrationWhereUniqueInput
  }

  /**
   * CorsairIntegration updateMany
   */
  export type CorsairIntegrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CorsairIntegrations.
     */
    data: XOR<CorsairIntegrationUpdateManyMutationInput, CorsairIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which CorsairIntegrations to update
     */
    where?: CorsairIntegrationWhereInput
    /**
     * Limit how many CorsairIntegrations to update.
     */
    limit?: number
  }

  /**
   * CorsairIntegration updateManyAndReturn
   */
  export type CorsairIntegrationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * The data used to update CorsairIntegrations.
     */
    data: XOR<CorsairIntegrationUpdateManyMutationInput, CorsairIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which CorsairIntegrations to update
     */
    where?: CorsairIntegrationWhereInput
    /**
     * Limit how many CorsairIntegrations to update.
     */
    limit?: number
  }

  /**
   * CorsairIntegration upsert
   */
  export type CorsairIntegrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * The filter to search for the CorsairIntegration to update in case it exists.
     */
    where: CorsairIntegrationWhereUniqueInput
    /**
     * In case the CorsairIntegration found by the `where` argument doesn't exist, create a new CorsairIntegration with this data.
     */
    create: XOR<CorsairIntegrationCreateInput, CorsairIntegrationUncheckedCreateInput>
    /**
     * In case the CorsairIntegration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CorsairIntegrationUpdateInput, CorsairIntegrationUncheckedUpdateInput>
  }

  /**
   * CorsairIntegration delete
   */
  export type CorsairIntegrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
    /**
     * Filter which CorsairIntegration to delete.
     */
    where: CorsairIntegrationWhereUniqueInput
  }

  /**
   * CorsairIntegration deleteMany
   */
  export type CorsairIntegrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairIntegrations to delete
     */
    where?: CorsairIntegrationWhereInput
    /**
     * Limit how many CorsairIntegrations to delete.
     */
    limit?: number
  }

  /**
   * CorsairIntegration.accounts
   */
  export type CorsairIntegration$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    where?: CorsairAccountWhereInput
    orderBy?: CorsairAccountOrderByWithRelationInput | CorsairAccountOrderByWithRelationInput[]
    cursor?: CorsairAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CorsairAccountScalarFieldEnum | CorsairAccountScalarFieldEnum[]
  }

  /**
   * CorsairIntegration without action
   */
  export type CorsairIntegrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairIntegration
     */
    select?: CorsairIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairIntegration
     */
    omit?: CorsairIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairIntegrationInclude<ExtArgs> | null
  }


  /**
   * Model CorsairAccount
   */

  export type AggregateCorsairAccount = {
    _count: CorsairAccountCountAggregateOutputType | null
    _min: CorsairAccountMinAggregateOutputType | null
    _max: CorsairAccountMaxAggregateOutputType | null
  }

  export type CorsairAccountMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    tenantId: string | null
    integrationId: string | null
    dek: string | null
  }

  export type CorsairAccountMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    tenantId: string | null
    integrationId: string | null
    dek: string | null
  }

  export type CorsairAccountCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    tenantId: number
    integrationId: number
    config: number
    dek: number
    _all: number
  }


  export type CorsairAccountMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    tenantId?: true
    integrationId?: true
    dek?: true
  }

  export type CorsairAccountMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    tenantId?: true
    integrationId?: true
    dek?: true
  }

  export type CorsairAccountCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    tenantId?: true
    integrationId?: true
    config?: true
    dek?: true
    _all?: true
  }

  export type CorsairAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairAccount to aggregate.
     */
    where?: CorsairAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairAccounts to fetch.
     */
    orderBy?: CorsairAccountOrderByWithRelationInput | CorsairAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CorsairAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CorsairAccounts
    **/
    _count?: true | CorsairAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CorsairAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CorsairAccountMaxAggregateInputType
  }

  export type GetCorsairAccountAggregateType<T extends CorsairAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateCorsairAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCorsairAccount[P]>
      : GetScalarType<T[P], AggregateCorsairAccount[P]>
  }




  export type CorsairAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairAccountWhereInput
    orderBy?: CorsairAccountOrderByWithAggregationInput | CorsairAccountOrderByWithAggregationInput[]
    by: CorsairAccountScalarFieldEnum[] | CorsairAccountScalarFieldEnum
    having?: CorsairAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CorsairAccountCountAggregateInputType | true
    _min?: CorsairAccountMinAggregateInputType
    _max?: CorsairAccountMaxAggregateInputType
  }

  export type CorsairAccountGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    tenantId: string
    integrationId: string
    config: JsonValue
    dek: string | null
    _count: CorsairAccountCountAggregateOutputType | null
    _min: CorsairAccountMinAggregateOutputType | null
    _max: CorsairAccountMaxAggregateOutputType | null
  }

  type GetCorsairAccountGroupByPayload<T extends CorsairAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CorsairAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CorsairAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CorsairAccountGroupByOutputType[P]>
            : GetScalarType<T[P], CorsairAccountGroupByOutputType[P]>
        }
      >
    >


  export type CorsairAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
    integrationId?: boolean
    config?: boolean
    dek?: boolean
    integration?: boolean | CorsairIntegrationDefaultArgs<ExtArgs>
    entities?: boolean | CorsairAccount$entitiesArgs<ExtArgs>
    events?: boolean | CorsairAccount$eventsArgs<ExtArgs>
    _count?: boolean | CorsairAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairAccount"]>

  export type CorsairAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
    integrationId?: boolean
    config?: boolean
    dek?: boolean
    integration?: boolean | CorsairIntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairAccount"]>

  export type CorsairAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
    integrationId?: boolean
    config?: boolean
    dek?: boolean
    integration?: boolean | CorsairIntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairAccount"]>

  export type CorsairAccountSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
    integrationId?: boolean
    config?: boolean
    dek?: boolean
  }

  export type CorsairAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "tenantId" | "integrationId" | "config" | "dek", ExtArgs["result"]["corsairAccount"]>
  export type CorsairAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | CorsairIntegrationDefaultArgs<ExtArgs>
    entities?: boolean | CorsairAccount$entitiesArgs<ExtArgs>
    events?: boolean | CorsairAccount$eventsArgs<ExtArgs>
    _count?: boolean | CorsairAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CorsairAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | CorsairIntegrationDefaultArgs<ExtArgs>
  }
  export type CorsairAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | CorsairIntegrationDefaultArgs<ExtArgs>
  }

  export type $CorsairAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CorsairAccount"
    objects: {
      integration: Prisma.$CorsairIntegrationPayload<ExtArgs>
      entities: Prisma.$CorsairEntityPayload<ExtArgs>[]
      events: Prisma.$CorsairEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      tenantId: string
      integrationId: string
      config: Prisma.JsonValue
      dek: string | null
    }, ExtArgs["result"]["corsairAccount"]>
    composites: {}
  }

  type CorsairAccountGetPayload<S extends boolean | null | undefined | CorsairAccountDefaultArgs> = $Result.GetResult<Prisma.$CorsairAccountPayload, S>

  type CorsairAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CorsairAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CorsairAccountCountAggregateInputType | true
    }

  export interface CorsairAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CorsairAccount'], meta: { name: 'CorsairAccount' } }
    /**
     * Find zero or one CorsairAccount that matches the filter.
     * @param {CorsairAccountFindUniqueArgs} args - Arguments to find a CorsairAccount
     * @example
     * // Get one CorsairAccount
     * const corsairAccount = await prisma.corsairAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CorsairAccountFindUniqueArgs>(args: SelectSubset<T, CorsairAccountFindUniqueArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CorsairAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CorsairAccountFindUniqueOrThrowArgs} args - Arguments to find a CorsairAccount
     * @example
     * // Get one CorsairAccount
     * const corsairAccount = await prisma.corsairAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CorsairAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, CorsairAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountFindFirstArgs} args - Arguments to find a CorsairAccount
     * @example
     * // Get one CorsairAccount
     * const corsairAccount = await prisma.corsairAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CorsairAccountFindFirstArgs>(args?: SelectSubset<T, CorsairAccountFindFirstArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountFindFirstOrThrowArgs} args - Arguments to find a CorsairAccount
     * @example
     * // Get one CorsairAccount
     * const corsairAccount = await prisma.corsairAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CorsairAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, CorsairAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CorsairAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CorsairAccounts
     * const corsairAccounts = await prisma.corsairAccount.findMany()
     * 
     * // Get first 10 CorsairAccounts
     * const corsairAccounts = await prisma.corsairAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const corsairAccountWithIdOnly = await prisma.corsairAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CorsairAccountFindManyArgs>(args?: SelectSubset<T, CorsairAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CorsairAccount.
     * @param {CorsairAccountCreateArgs} args - Arguments to create a CorsairAccount.
     * @example
     * // Create one CorsairAccount
     * const CorsairAccount = await prisma.corsairAccount.create({
     *   data: {
     *     // ... data to create a CorsairAccount
     *   }
     * })
     * 
     */
    create<T extends CorsairAccountCreateArgs>(args: SelectSubset<T, CorsairAccountCreateArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CorsairAccounts.
     * @param {CorsairAccountCreateManyArgs} args - Arguments to create many CorsairAccounts.
     * @example
     * // Create many CorsairAccounts
     * const corsairAccount = await prisma.corsairAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CorsairAccountCreateManyArgs>(args?: SelectSubset<T, CorsairAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CorsairAccounts and returns the data saved in the database.
     * @param {CorsairAccountCreateManyAndReturnArgs} args - Arguments to create many CorsairAccounts.
     * @example
     * // Create many CorsairAccounts
     * const corsairAccount = await prisma.corsairAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CorsairAccounts and only return the `id`
     * const corsairAccountWithIdOnly = await prisma.corsairAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CorsairAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, CorsairAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CorsairAccount.
     * @param {CorsairAccountDeleteArgs} args - Arguments to delete one CorsairAccount.
     * @example
     * // Delete one CorsairAccount
     * const CorsairAccount = await prisma.corsairAccount.delete({
     *   where: {
     *     // ... filter to delete one CorsairAccount
     *   }
     * })
     * 
     */
    delete<T extends CorsairAccountDeleteArgs>(args: SelectSubset<T, CorsairAccountDeleteArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CorsairAccount.
     * @param {CorsairAccountUpdateArgs} args - Arguments to update one CorsairAccount.
     * @example
     * // Update one CorsairAccount
     * const corsairAccount = await prisma.corsairAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CorsairAccountUpdateArgs>(args: SelectSubset<T, CorsairAccountUpdateArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CorsairAccounts.
     * @param {CorsairAccountDeleteManyArgs} args - Arguments to filter CorsairAccounts to delete.
     * @example
     * // Delete a few CorsairAccounts
     * const { count } = await prisma.corsairAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CorsairAccountDeleteManyArgs>(args?: SelectSubset<T, CorsairAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CorsairAccounts
     * const corsairAccount = await prisma.corsairAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CorsairAccountUpdateManyArgs>(args: SelectSubset<T, CorsairAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairAccounts and returns the data updated in the database.
     * @param {CorsairAccountUpdateManyAndReturnArgs} args - Arguments to update many CorsairAccounts.
     * @example
     * // Update many CorsairAccounts
     * const corsairAccount = await prisma.corsairAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CorsairAccounts and only return the `id`
     * const corsairAccountWithIdOnly = await prisma.corsairAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CorsairAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, CorsairAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CorsairAccount.
     * @param {CorsairAccountUpsertArgs} args - Arguments to update or create a CorsairAccount.
     * @example
     * // Update or create a CorsairAccount
     * const corsairAccount = await prisma.corsairAccount.upsert({
     *   create: {
     *     // ... data to create a CorsairAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CorsairAccount we want to update
     *   }
     * })
     */
    upsert<T extends CorsairAccountUpsertArgs>(args: SelectSubset<T, CorsairAccountUpsertArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CorsairAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountCountArgs} args - Arguments to filter CorsairAccounts to count.
     * @example
     * // Count the number of CorsairAccounts
     * const count = await prisma.corsairAccount.count({
     *   where: {
     *     // ... the filter for the CorsairAccounts we want to count
     *   }
     * })
    **/
    count<T extends CorsairAccountCountArgs>(
      args?: Subset<T, CorsairAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CorsairAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CorsairAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CorsairAccountAggregateArgs>(args: Subset<T, CorsairAccountAggregateArgs>): Prisma.PrismaPromise<GetCorsairAccountAggregateType<T>>

    /**
     * Group by CorsairAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CorsairAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CorsairAccountGroupByArgs['orderBy'] }
        : { orderBy?: CorsairAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CorsairAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorsairAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CorsairAccount model
   */
  readonly fields: CorsairAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CorsairAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CorsairAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    integration<T extends CorsairIntegrationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CorsairIntegrationDefaultArgs<ExtArgs>>): Prisma__CorsairIntegrationClient<$Result.GetResult<Prisma.$CorsairIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    entities<T extends CorsairAccount$entitiesArgs<ExtArgs> = {}>(args?: Subset<T, CorsairAccount$entitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends CorsairAccount$eventsArgs<ExtArgs> = {}>(args?: Subset<T, CorsairAccount$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CorsairAccount model
   */
  interface CorsairAccountFieldRefs {
    readonly id: FieldRef<"CorsairAccount", 'String'>
    readonly createdAt: FieldRef<"CorsairAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"CorsairAccount", 'DateTime'>
    readonly tenantId: FieldRef<"CorsairAccount", 'String'>
    readonly integrationId: FieldRef<"CorsairAccount", 'String'>
    readonly config: FieldRef<"CorsairAccount", 'Json'>
    readonly dek: FieldRef<"CorsairAccount", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CorsairAccount findUnique
   */
  export type CorsairAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * Filter, which CorsairAccount to fetch.
     */
    where: CorsairAccountWhereUniqueInput
  }

  /**
   * CorsairAccount findUniqueOrThrow
   */
  export type CorsairAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * Filter, which CorsairAccount to fetch.
     */
    where: CorsairAccountWhereUniqueInput
  }

  /**
   * CorsairAccount findFirst
   */
  export type CorsairAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * Filter, which CorsairAccount to fetch.
     */
    where?: CorsairAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairAccounts to fetch.
     */
    orderBy?: CorsairAccountOrderByWithRelationInput | CorsairAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairAccounts.
     */
    cursor?: CorsairAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairAccounts.
     */
    distinct?: CorsairAccountScalarFieldEnum | CorsairAccountScalarFieldEnum[]
  }

  /**
   * CorsairAccount findFirstOrThrow
   */
  export type CorsairAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * Filter, which CorsairAccount to fetch.
     */
    where?: CorsairAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairAccounts to fetch.
     */
    orderBy?: CorsairAccountOrderByWithRelationInput | CorsairAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairAccounts.
     */
    cursor?: CorsairAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairAccounts.
     */
    distinct?: CorsairAccountScalarFieldEnum | CorsairAccountScalarFieldEnum[]
  }

  /**
   * CorsairAccount findMany
   */
  export type CorsairAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * Filter, which CorsairAccounts to fetch.
     */
    where?: CorsairAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairAccounts to fetch.
     */
    orderBy?: CorsairAccountOrderByWithRelationInput | CorsairAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CorsairAccounts.
     */
    cursor?: CorsairAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairAccounts.
     */
    skip?: number
    distinct?: CorsairAccountScalarFieldEnum | CorsairAccountScalarFieldEnum[]
  }

  /**
   * CorsairAccount create
   */
  export type CorsairAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a CorsairAccount.
     */
    data: XOR<CorsairAccountCreateInput, CorsairAccountUncheckedCreateInput>
  }

  /**
   * CorsairAccount createMany
   */
  export type CorsairAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CorsairAccounts.
     */
    data: CorsairAccountCreateManyInput | CorsairAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorsairAccount createManyAndReturn
   */
  export type CorsairAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * The data used to create many CorsairAccounts.
     */
    data: CorsairAccountCreateManyInput | CorsairAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorsairAccount update
   */
  export type CorsairAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a CorsairAccount.
     */
    data: XOR<CorsairAccountUpdateInput, CorsairAccountUncheckedUpdateInput>
    /**
     * Choose, which CorsairAccount to update.
     */
    where: CorsairAccountWhereUniqueInput
  }

  /**
   * CorsairAccount updateMany
   */
  export type CorsairAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CorsairAccounts.
     */
    data: XOR<CorsairAccountUpdateManyMutationInput, CorsairAccountUncheckedUpdateManyInput>
    /**
     * Filter which CorsairAccounts to update
     */
    where?: CorsairAccountWhereInput
    /**
     * Limit how many CorsairAccounts to update.
     */
    limit?: number
  }

  /**
   * CorsairAccount updateManyAndReturn
   */
  export type CorsairAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * The data used to update CorsairAccounts.
     */
    data: XOR<CorsairAccountUpdateManyMutationInput, CorsairAccountUncheckedUpdateManyInput>
    /**
     * Filter which CorsairAccounts to update
     */
    where?: CorsairAccountWhereInput
    /**
     * Limit how many CorsairAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorsairAccount upsert
   */
  export type CorsairAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the CorsairAccount to update in case it exists.
     */
    where: CorsairAccountWhereUniqueInput
    /**
     * In case the CorsairAccount found by the `where` argument doesn't exist, create a new CorsairAccount with this data.
     */
    create: XOR<CorsairAccountCreateInput, CorsairAccountUncheckedCreateInput>
    /**
     * In case the CorsairAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CorsairAccountUpdateInput, CorsairAccountUncheckedUpdateInput>
  }

  /**
   * CorsairAccount delete
   */
  export type CorsairAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
    /**
     * Filter which CorsairAccount to delete.
     */
    where: CorsairAccountWhereUniqueInput
  }

  /**
   * CorsairAccount deleteMany
   */
  export type CorsairAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairAccounts to delete
     */
    where?: CorsairAccountWhereInput
    /**
     * Limit how many CorsairAccounts to delete.
     */
    limit?: number
  }

  /**
   * CorsairAccount.entities
   */
  export type CorsairAccount$entitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    where?: CorsairEntityWhereInput
    orderBy?: CorsairEntityOrderByWithRelationInput | CorsairEntityOrderByWithRelationInput[]
    cursor?: CorsairEntityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CorsairEntityScalarFieldEnum | CorsairEntityScalarFieldEnum[]
  }

  /**
   * CorsairAccount.events
   */
  export type CorsairAccount$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    where?: CorsairEventWhereInput
    orderBy?: CorsairEventOrderByWithRelationInput | CorsairEventOrderByWithRelationInput[]
    cursor?: CorsairEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CorsairEventScalarFieldEnum | CorsairEventScalarFieldEnum[]
  }

  /**
   * CorsairAccount without action
   */
  export type CorsairAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairAccount
     */
    select?: CorsairAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairAccount
     */
    omit?: CorsairAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairAccountInclude<ExtArgs> | null
  }


  /**
   * Model CorsairEntity
   */

  export type AggregateCorsairEntity = {
    _count: CorsairEntityCountAggregateOutputType | null
    _min: CorsairEntityMinAggregateOutputType | null
    _max: CorsairEntityMaxAggregateOutputType | null
  }

  export type CorsairEntityMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accountId: string | null
    entityId: string | null
    entityType: string | null
    version: string | null
  }

  export type CorsairEntityMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accountId: string | null
    entityId: string | null
    entityType: string | null
    version: string | null
  }

  export type CorsairEntityCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    accountId: number
    entityId: number
    entityType: number
    version: number
    data: number
    _all: number
  }


  export type CorsairEntityMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    entityId?: true
    entityType?: true
    version?: true
  }

  export type CorsairEntityMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    entityId?: true
    entityType?: true
    version?: true
  }

  export type CorsairEntityCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    entityId?: true
    entityType?: true
    version?: true
    data?: true
    _all?: true
  }

  export type CorsairEntityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairEntity to aggregate.
     */
    where?: CorsairEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEntities to fetch.
     */
    orderBy?: CorsairEntityOrderByWithRelationInput | CorsairEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CorsairEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CorsairEntities
    **/
    _count?: true | CorsairEntityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CorsairEntityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CorsairEntityMaxAggregateInputType
  }

  export type GetCorsairEntityAggregateType<T extends CorsairEntityAggregateArgs> = {
        [P in keyof T & keyof AggregateCorsairEntity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCorsairEntity[P]>
      : GetScalarType<T[P], AggregateCorsairEntity[P]>
  }




  export type CorsairEntityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairEntityWhereInput
    orderBy?: CorsairEntityOrderByWithAggregationInput | CorsairEntityOrderByWithAggregationInput[]
    by: CorsairEntityScalarFieldEnum[] | CorsairEntityScalarFieldEnum
    having?: CorsairEntityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CorsairEntityCountAggregateInputType | true
    _min?: CorsairEntityMinAggregateInputType
    _max?: CorsairEntityMaxAggregateInputType
  }

  export type CorsairEntityGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    accountId: string
    entityId: string
    entityType: string
    version: string
    data: JsonValue
    _count: CorsairEntityCountAggregateOutputType | null
    _min: CorsairEntityMinAggregateOutputType | null
    _max: CorsairEntityMaxAggregateOutputType | null
  }

  type GetCorsairEntityGroupByPayload<T extends CorsairEntityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CorsairEntityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CorsairEntityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CorsairEntityGroupByOutputType[P]>
            : GetScalarType<T[P], CorsairEntityGroupByOutputType[P]>
        }
      >
    >


  export type CorsairEntitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    entityId?: boolean
    entityType?: boolean
    version?: boolean
    data?: boolean
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairEntity"]>

  export type CorsairEntitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    entityId?: boolean
    entityType?: boolean
    version?: boolean
    data?: boolean
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairEntity"]>

  export type CorsairEntitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    entityId?: boolean
    entityType?: boolean
    version?: boolean
    data?: boolean
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairEntity"]>

  export type CorsairEntitySelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    entityId?: boolean
    entityType?: boolean
    version?: boolean
    data?: boolean
  }

  export type CorsairEntityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "accountId" | "entityId" | "entityType" | "version" | "data", ExtArgs["result"]["corsairEntity"]>
  export type CorsairEntityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }
  export type CorsairEntityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }
  export type CorsairEntityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }

  export type $CorsairEntityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CorsairEntity"
    objects: {
      account: Prisma.$CorsairAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      accountId: string
      entityId: string
      entityType: string
      version: string
      data: Prisma.JsonValue
    }, ExtArgs["result"]["corsairEntity"]>
    composites: {}
  }

  type CorsairEntityGetPayload<S extends boolean | null | undefined | CorsairEntityDefaultArgs> = $Result.GetResult<Prisma.$CorsairEntityPayload, S>

  type CorsairEntityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CorsairEntityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CorsairEntityCountAggregateInputType | true
    }

  export interface CorsairEntityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CorsairEntity'], meta: { name: 'CorsairEntity' } }
    /**
     * Find zero or one CorsairEntity that matches the filter.
     * @param {CorsairEntityFindUniqueArgs} args - Arguments to find a CorsairEntity
     * @example
     * // Get one CorsairEntity
     * const corsairEntity = await prisma.corsairEntity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CorsairEntityFindUniqueArgs>(args: SelectSubset<T, CorsairEntityFindUniqueArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CorsairEntity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CorsairEntityFindUniqueOrThrowArgs} args - Arguments to find a CorsairEntity
     * @example
     * // Get one CorsairEntity
     * const corsairEntity = await prisma.corsairEntity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CorsairEntityFindUniqueOrThrowArgs>(args: SelectSubset<T, CorsairEntityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairEntity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityFindFirstArgs} args - Arguments to find a CorsairEntity
     * @example
     * // Get one CorsairEntity
     * const corsairEntity = await prisma.corsairEntity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CorsairEntityFindFirstArgs>(args?: SelectSubset<T, CorsairEntityFindFirstArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairEntity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityFindFirstOrThrowArgs} args - Arguments to find a CorsairEntity
     * @example
     * // Get one CorsairEntity
     * const corsairEntity = await prisma.corsairEntity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CorsairEntityFindFirstOrThrowArgs>(args?: SelectSubset<T, CorsairEntityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CorsairEntities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CorsairEntities
     * const corsairEntities = await prisma.corsairEntity.findMany()
     * 
     * // Get first 10 CorsairEntities
     * const corsairEntities = await prisma.corsairEntity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const corsairEntityWithIdOnly = await prisma.corsairEntity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CorsairEntityFindManyArgs>(args?: SelectSubset<T, CorsairEntityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CorsairEntity.
     * @param {CorsairEntityCreateArgs} args - Arguments to create a CorsairEntity.
     * @example
     * // Create one CorsairEntity
     * const CorsairEntity = await prisma.corsairEntity.create({
     *   data: {
     *     // ... data to create a CorsairEntity
     *   }
     * })
     * 
     */
    create<T extends CorsairEntityCreateArgs>(args: SelectSubset<T, CorsairEntityCreateArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CorsairEntities.
     * @param {CorsairEntityCreateManyArgs} args - Arguments to create many CorsairEntities.
     * @example
     * // Create many CorsairEntities
     * const corsairEntity = await prisma.corsairEntity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CorsairEntityCreateManyArgs>(args?: SelectSubset<T, CorsairEntityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CorsairEntities and returns the data saved in the database.
     * @param {CorsairEntityCreateManyAndReturnArgs} args - Arguments to create many CorsairEntities.
     * @example
     * // Create many CorsairEntities
     * const corsairEntity = await prisma.corsairEntity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CorsairEntities and only return the `id`
     * const corsairEntityWithIdOnly = await prisma.corsairEntity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CorsairEntityCreateManyAndReturnArgs>(args?: SelectSubset<T, CorsairEntityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CorsairEntity.
     * @param {CorsairEntityDeleteArgs} args - Arguments to delete one CorsairEntity.
     * @example
     * // Delete one CorsairEntity
     * const CorsairEntity = await prisma.corsairEntity.delete({
     *   where: {
     *     // ... filter to delete one CorsairEntity
     *   }
     * })
     * 
     */
    delete<T extends CorsairEntityDeleteArgs>(args: SelectSubset<T, CorsairEntityDeleteArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CorsairEntity.
     * @param {CorsairEntityUpdateArgs} args - Arguments to update one CorsairEntity.
     * @example
     * // Update one CorsairEntity
     * const corsairEntity = await prisma.corsairEntity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CorsairEntityUpdateArgs>(args: SelectSubset<T, CorsairEntityUpdateArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CorsairEntities.
     * @param {CorsairEntityDeleteManyArgs} args - Arguments to filter CorsairEntities to delete.
     * @example
     * // Delete a few CorsairEntities
     * const { count } = await prisma.corsairEntity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CorsairEntityDeleteManyArgs>(args?: SelectSubset<T, CorsairEntityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairEntities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CorsairEntities
     * const corsairEntity = await prisma.corsairEntity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CorsairEntityUpdateManyArgs>(args: SelectSubset<T, CorsairEntityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairEntities and returns the data updated in the database.
     * @param {CorsairEntityUpdateManyAndReturnArgs} args - Arguments to update many CorsairEntities.
     * @example
     * // Update many CorsairEntities
     * const corsairEntity = await prisma.corsairEntity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CorsairEntities and only return the `id`
     * const corsairEntityWithIdOnly = await prisma.corsairEntity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CorsairEntityUpdateManyAndReturnArgs>(args: SelectSubset<T, CorsairEntityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CorsairEntity.
     * @param {CorsairEntityUpsertArgs} args - Arguments to update or create a CorsairEntity.
     * @example
     * // Update or create a CorsairEntity
     * const corsairEntity = await prisma.corsairEntity.upsert({
     *   create: {
     *     // ... data to create a CorsairEntity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CorsairEntity we want to update
     *   }
     * })
     */
    upsert<T extends CorsairEntityUpsertArgs>(args: SelectSubset<T, CorsairEntityUpsertArgs<ExtArgs>>): Prisma__CorsairEntityClient<$Result.GetResult<Prisma.$CorsairEntityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CorsairEntities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityCountArgs} args - Arguments to filter CorsairEntities to count.
     * @example
     * // Count the number of CorsairEntities
     * const count = await prisma.corsairEntity.count({
     *   where: {
     *     // ... the filter for the CorsairEntities we want to count
     *   }
     * })
    **/
    count<T extends CorsairEntityCountArgs>(
      args?: Subset<T, CorsairEntityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CorsairEntityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CorsairEntity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CorsairEntityAggregateArgs>(args: Subset<T, CorsairEntityAggregateArgs>): Prisma.PrismaPromise<GetCorsairEntityAggregateType<T>>

    /**
     * Group by CorsairEntity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEntityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CorsairEntityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CorsairEntityGroupByArgs['orderBy'] }
        : { orderBy?: CorsairEntityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CorsairEntityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorsairEntityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CorsairEntity model
   */
  readonly fields: CorsairEntityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CorsairEntity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CorsairEntityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends CorsairAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CorsairAccountDefaultArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CorsairEntity model
   */
  interface CorsairEntityFieldRefs {
    readonly id: FieldRef<"CorsairEntity", 'String'>
    readonly createdAt: FieldRef<"CorsairEntity", 'DateTime'>
    readonly updatedAt: FieldRef<"CorsairEntity", 'DateTime'>
    readonly accountId: FieldRef<"CorsairEntity", 'String'>
    readonly entityId: FieldRef<"CorsairEntity", 'String'>
    readonly entityType: FieldRef<"CorsairEntity", 'String'>
    readonly version: FieldRef<"CorsairEntity", 'String'>
    readonly data: FieldRef<"CorsairEntity", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * CorsairEntity findUnique
   */
  export type CorsairEntityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEntity to fetch.
     */
    where: CorsairEntityWhereUniqueInput
  }

  /**
   * CorsairEntity findUniqueOrThrow
   */
  export type CorsairEntityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEntity to fetch.
     */
    where: CorsairEntityWhereUniqueInput
  }

  /**
   * CorsairEntity findFirst
   */
  export type CorsairEntityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEntity to fetch.
     */
    where?: CorsairEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEntities to fetch.
     */
    orderBy?: CorsairEntityOrderByWithRelationInput | CorsairEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairEntities.
     */
    cursor?: CorsairEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairEntities.
     */
    distinct?: CorsairEntityScalarFieldEnum | CorsairEntityScalarFieldEnum[]
  }

  /**
   * CorsairEntity findFirstOrThrow
   */
  export type CorsairEntityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEntity to fetch.
     */
    where?: CorsairEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEntities to fetch.
     */
    orderBy?: CorsairEntityOrderByWithRelationInput | CorsairEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairEntities.
     */
    cursor?: CorsairEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairEntities.
     */
    distinct?: CorsairEntityScalarFieldEnum | CorsairEntityScalarFieldEnum[]
  }

  /**
   * CorsairEntity findMany
   */
  export type CorsairEntityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEntities to fetch.
     */
    where?: CorsairEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEntities to fetch.
     */
    orderBy?: CorsairEntityOrderByWithRelationInput | CorsairEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CorsairEntities.
     */
    cursor?: CorsairEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEntities.
     */
    skip?: number
    distinct?: CorsairEntityScalarFieldEnum | CorsairEntityScalarFieldEnum[]
  }

  /**
   * CorsairEntity create
   */
  export type CorsairEntityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * The data needed to create a CorsairEntity.
     */
    data: XOR<CorsairEntityCreateInput, CorsairEntityUncheckedCreateInput>
  }

  /**
   * CorsairEntity createMany
   */
  export type CorsairEntityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CorsairEntities.
     */
    data: CorsairEntityCreateManyInput | CorsairEntityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorsairEntity createManyAndReturn
   */
  export type CorsairEntityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * The data used to create many CorsairEntities.
     */
    data: CorsairEntityCreateManyInput | CorsairEntityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorsairEntity update
   */
  export type CorsairEntityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * The data needed to update a CorsairEntity.
     */
    data: XOR<CorsairEntityUpdateInput, CorsairEntityUncheckedUpdateInput>
    /**
     * Choose, which CorsairEntity to update.
     */
    where: CorsairEntityWhereUniqueInput
  }

  /**
   * CorsairEntity updateMany
   */
  export type CorsairEntityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CorsairEntities.
     */
    data: XOR<CorsairEntityUpdateManyMutationInput, CorsairEntityUncheckedUpdateManyInput>
    /**
     * Filter which CorsairEntities to update
     */
    where?: CorsairEntityWhereInput
    /**
     * Limit how many CorsairEntities to update.
     */
    limit?: number
  }

  /**
   * CorsairEntity updateManyAndReturn
   */
  export type CorsairEntityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * The data used to update CorsairEntities.
     */
    data: XOR<CorsairEntityUpdateManyMutationInput, CorsairEntityUncheckedUpdateManyInput>
    /**
     * Filter which CorsairEntities to update
     */
    where?: CorsairEntityWhereInput
    /**
     * Limit how many CorsairEntities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorsairEntity upsert
   */
  export type CorsairEntityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * The filter to search for the CorsairEntity to update in case it exists.
     */
    where: CorsairEntityWhereUniqueInput
    /**
     * In case the CorsairEntity found by the `where` argument doesn't exist, create a new CorsairEntity with this data.
     */
    create: XOR<CorsairEntityCreateInput, CorsairEntityUncheckedCreateInput>
    /**
     * In case the CorsairEntity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CorsairEntityUpdateInput, CorsairEntityUncheckedUpdateInput>
  }

  /**
   * CorsairEntity delete
   */
  export type CorsairEntityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
    /**
     * Filter which CorsairEntity to delete.
     */
    where: CorsairEntityWhereUniqueInput
  }

  /**
   * CorsairEntity deleteMany
   */
  export type CorsairEntityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairEntities to delete
     */
    where?: CorsairEntityWhereInput
    /**
     * Limit how many CorsairEntities to delete.
     */
    limit?: number
  }

  /**
   * CorsairEntity without action
   */
  export type CorsairEntityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEntity
     */
    select?: CorsairEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEntity
     */
    omit?: CorsairEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEntityInclude<ExtArgs> | null
  }


  /**
   * Model CorsairEvent
   */

  export type AggregateCorsairEvent = {
    _count: CorsairEventCountAggregateOutputType | null
    _min: CorsairEventMinAggregateOutputType | null
    _max: CorsairEventMaxAggregateOutputType | null
  }

  export type CorsairEventMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accountId: string | null
    eventType: string | null
    status: string | null
  }

  export type CorsairEventMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accountId: string | null
    eventType: string | null
    status: string | null
  }

  export type CorsairEventCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    accountId: number
    eventType: number
    payload: number
    status: number
    _all: number
  }


  export type CorsairEventMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    eventType?: true
    status?: true
  }

  export type CorsairEventMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    eventType?: true
    status?: true
  }

  export type CorsairEventCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    eventType?: true
    payload?: true
    status?: true
    _all?: true
  }

  export type CorsairEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairEvent to aggregate.
     */
    where?: CorsairEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEvents to fetch.
     */
    orderBy?: CorsairEventOrderByWithRelationInput | CorsairEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CorsairEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CorsairEvents
    **/
    _count?: true | CorsairEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CorsairEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CorsairEventMaxAggregateInputType
  }

  export type GetCorsairEventAggregateType<T extends CorsairEventAggregateArgs> = {
        [P in keyof T & keyof AggregateCorsairEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCorsairEvent[P]>
      : GetScalarType<T[P], AggregateCorsairEvent[P]>
  }




  export type CorsairEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorsairEventWhereInput
    orderBy?: CorsairEventOrderByWithAggregationInput | CorsairEventOrderByWithAggregationInput[]
    by: CorsairEventScalarFieldEnum[] | CorsairEventScalarFieldEnum
    having?: CorsairEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CorsairEventCountAggregateInputType | true
    _min?: CorsairEventMinAggregateInputType
    _max?: CorsairEventMaxAggregateInputType
  }

  export type CorsairEventGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    accountId: string
    eventType: string
    payload: JsonValue
    status: string | null
    _count: CorsairEventCountAggregateOutputType | null
    _min: CorsairEventMinAggregateOutputType | null
    _max: CorsairEventMaxAggregateOutputType | null
  }

  type GetCorsairEventGroupByPayload<T extends CorsairEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CorsairEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CorsairEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CorsairEventGroupByOutputType[P]>
            : GetScalarType<T[P], CorsairEventGroupByOutputType[P]>
        }
      >
    >


  export type CorsairEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairEvent"]>

  export type CorsairEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairEvent"]>

  export type CorsairEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["corsairEvent"]>

  export type CorsairEventSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
  }

  export type CorsairEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "accountId" | "eventType" | "payload" | "status", ExtArgs["result"]["corsairEvent"]>
  export type CorsairEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }
  export type CorsairEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }
  export type CorsairEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | CorsairAccountDefaultArgs<ExtArgs>
  }

  export type $CorsairEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CorsairEvent"
    objects: {
      account: Prisma.$CorsairAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      accountId: string
      eventType: string
      payload: Prisma.JsonValue
      status: string | null
    }, ExtArgs["result"]["corsairEvent"]>
    composites: {}
  }

  type CorsairEventGetPayload<S extends boolean | null | undefined | CorsairEventDefaultArgs> = $Result.GetResult<Prisma.$CorsairEventPayload, S>

  type CorsairEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CorsairEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CorsairEventCountAggregateInputType | true
    }

  export interface CorsairEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CorsairEvent'], meta: { name: 'CorsairEvent' } }
    /**
     * Find zero or one CorsairEvent that matches the filter.
     * @param {CorsairEventFindUniqueArgs} args - Arguments to find a CorsairEvent
     * @example
     * // Get one CorsairEvent
     * const corsairEvent = await prisma.corsairEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CorsairEventFindUniqueArgs>(args: SelectSubset<T, CorsairEventFindUniqueArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CorsairEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CorsairEventFindUniqueOrThrowArgs} args - Arguments to find a CorsairEvent
     * @example
     * // Get one CorsairEvent
     * const corsairEvent = await prisma.corsairEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CorsairEventFindUniqueOrThrowArgs>(args: SelectSubset<T, CorsairEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventFindFirstArgs} args - Arguments to find a CorsairEvent
     * @example
     * // Get one CorsairEvent
     * const corsairEvent = await prisma.corsairEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CorsairEventFindFirstArgs>(args?: SelectSubset<T, CorsairEventFindFirstArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorsairEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventFindFirstOrThrowArgs} args - Arguments to find a CorsairEvent
     * @example
     * // Get one CorsairEvent
     * const corsairEvent = await prisma.corsairEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CorsairEventFindFirstOrThrowArgs>(args?: SelectSubset<T, CorsairEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CorsairEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CorsairEvents
     * const corsairEvents = await prisma.corsairEvent.findMany()
     * 
     * // Get first 10 CorsairEvents
     * const corsairEvents = await prisma.corsairEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const corsairEventWithIdOnly = await prisma.corsairEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CorsairEventFindManyArgs>(args?: SelectSubset<T, CorsairEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CorsairEvent.
     * @param {CorsairEventCreateArgs} args - Arguments to create a CorsairEvent.
     * @example
     * // Create one CorsairEvent
     * const CorsairEvent = await prisma.corsairEvent.create({
     *   data: {
     *     // ... data to create a CorsairEvent
     *   }
     * })
     * 
     */
    create<T extends CorsairEventCreateArgs>(args: SelectSubset<T, CorsairEventCreateArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CorsairEvents.
     * @param {CorsairEventCreateManyArgs} args - Arguments to create many CorsairEvents.
     * @example
     * // Create many CorsairEvents
     * const corsairEvent = await prisma.corsairEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CorsairEventCreateManyArgs>(args?: SelectSubset<T, CorsairEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CorsairEvents and returns the data saved in the database.
     * @param {CorsairEventCreateManyAndReturnArgs} args - Arguments to create many CorsairEvents.
     * @example
     * // Create many CorsairEvents
     * const corsairEvent = await prisma.corsairEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CorsairEvents and only return the `id`
     * const corsairEventWithIdOnly = await prisma.corsairEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CorsairEventCreateManyAndReturnArgs>(args?: SelectSubset<T, CorsairEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CorsairEvent.
     * @param {CorsairEventDeleteArgs} args - Arguments to delete one CorsairEvent.
     * @example
     * // Delete one CorsairEvent
     * const CorsairEvent = await prisma.corsairEvent.delete({
     *   where: {
     *     // ... filter to delete one CorsairEvent
     *   }
     * })
     * 
     */
    delete<T extends CorsairEventDeleteArgs>(args: SelectSubset<T, CorsairEventDeleteArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CorsairEvent.
     * @param {CorsairEventUpdateArgs} args - Arguments to update one CorsairEvent.
     * @example
     * // Update one CorsairEvent
     * const corsairEvent = await prisma.corsairEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CorsairEventUpdateArgs>(args: SelectSubset<T, CorsairEventUpdateArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CorsairEvents.
     * @param {CorsairEventDeleteManyArgs} args - Arguments to filter CorsairEvents to delete.
     * @example
     * // Delete a few CorsairEvents
     * const { count } = await prisma.corsairEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CorsairEventDeleteManyArgs>(args?: SelectSubset<T, CorsairEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CorsairEvents
     * const corsairEvent = await prisma.corsairEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CorsairEventUpdateManyArgs>(args: SelectSubset<T, CorsairEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorsairEvents and returns the data updated in the database.
     * @param {CorsairEventUpdateManyAndReturnArgs} args - Arguments to update many CorsairEvents.
     * @example
     * // Update many CorsairEvents
     * const corsairEvent = await prisma.corsairEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CorsairEvents and only return the `id`
     * const corsairEventWithIdOnly = await prisma.corsairEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CorsairEventUpdateManyAndReturnArgs>(args: SelectSubset<T, CorsairEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CorsairEvent.
     * @param {CorsairEventUpsertArgs} args - Arguments to update or create a CorsairEvent.
     * @example
     * // Update or create a CorsairEvent
     * const corsairEvent = await prisma.corsairEvent.upsert({
     *   create: {
     *     // ... data to create a CorsairEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CorsairEvent we want to update
     *   }
     * })
     */
    upsert<T extends CorsairEventUpsertArgs>(args: SelectSubset<T, CorsairEventUpsertArgs<ExtArgs>>): Prisma__CorsairEventClient<$Result.GetResult<Prisma.$CorsairEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CorsairEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventCountArgs} args - Arguments to filter CorsairEvents to count.
     * @example
     * // Count the number of CorsairEvents
     * const count = await prisma.corsairEvent.count({
     *   where: {
     *     // ... the filter for the CorsairEvents we want to count
     *   }
     * })
    **/
    count<T extends CorsairEventCountArgs>(
      args?: Subset<T, CorsairEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CorsairEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CorsairEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CorsairEventAggregateArgs>(args: Subset<T, CorsairEventAggregateArgs>): Prisma.PrismaPromise<GetCorsairEventAggregateType<T>>

    /**
     * Group by CorsairEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorsairEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CorsairEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CorsairEventGroupByArgs['orderBy'] }
        : { orderBy?: CorsairEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CorsairEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorsairEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CorsairEvent model
   */
  readonly fields: CorsairEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CorsairEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CorsairEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends CorsairAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CorsairAccountDefaultArgs<ExtArgs>>): Prisma__CorsairAccountClient<$Result.GetResult<Prisma.$CorsairAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CorsairEvent model
   */
  interface CorsairEventFieldRefs {
    readonly id: FieldRef<"CorsairEvent", 'String'>
    readonly createdAt: FieldRef<"CorsairEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"CorsairEvent", 'DateTime'>
    readonly accountId: FieldRef<"CorsairEvent", 'String'>
    readonly eventType: FieldRef<"CorsairEvent", 'String'>
    readonly payload: FieldRef<"CorsairEvent", 'Json'>
    readonly status: FieldRef<"CorsairEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CorsairEvent findUnique
   */
  export type CorsairEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEvent to fetch.
     */
    where: CorsairEventWhereUniqueInput
  }

  /**
   * CorsairEvent findUniqueOrThrow
   */
  export type CorsairEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEvent to fetch.
     */
    where: CorsairEventWhereUniqueInput
  }

  /**
   * CorsairEvent findFirst
   */
  export type CorsairEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEvent to fetch.
     */
    where?: CorsairEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEvents to fetch.
     */
    orderBy?: CorsairEventOrderByWithRelationInput | CorsairEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairEvents.
     */
    cursor?: CorsairEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairEvents.
     */
    distinct?: CorsairEventScalarFieldEnum | CorsairEventScalarFieldEnum[]
  }

  /**
   * CorsairEvent findFirstOrThrow
   */
  export type CorsairEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEvent to fetch.
     */
    where?: CorsairEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEvents to fetch.
     */
    orderBy?: CorsairEventOrderByWithRelationInput | CorsairEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorsairEvents.
     */
    cursor?: CorsairEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorsairEvents.
     */
    distinct?: CorsairEventScalarFieldEnum | CorsairEventScalarFieldEnum[]
  }

  /**
   * CorsairEvent findMany
   */
  export type CorsairEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * Filter, which CorsairEvents to fetch.
     */
    where?: CorsairEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorsairEvents to fetch.
     */
    orderBy?: CorsairEventOrderByWithRelationInput | CorsairEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CorsairEvents.
     */
    cursor?: CorsairEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorsairEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorsairEvents.
     */
    skip?: number
    distinct?: CorsairEventScalarFieldEnum | CorsairEventScalarFieldEnum[]
  }

  /**
   * CorsairEvent create
   */
  export type CorsairEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * The data needed to create a CorsairEvent.
     */
    data: XOR<CorsairEventCreateInput, CorsairEventUncheckedCreateInput>
  }

  /**
   * CorsairEvent createMany
   */
  export type CorsairEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CorsairEvents.
     */
    data: CorsairEventCreateManyInput | CorsairEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorsairEvent createManyAndReturn
   */
  export type CorsairEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * The data used to create many CorsairEvents.
     */
    data: CorsairEventCreateManyInput | CorsairEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorsairEvent update
   */
  export type CorsairEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * The data needed to update a CorsairEvent.
     */
    data: XOR<CorsairEventUpdateInput, CorsairEventUncheckedUpdateInput>
    /**
     * Choose, which CorsairEvent to update.
     */
    where: CorsairEventWhereUniqueInput
  }

  /**
   * CorsairEvent updateMany
   */
  export type CorsairEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CorsairEvents.
     */
    data: XOR<CorsairEventUpdateManyMutationInput, CorsairEventUncheckedUpdateManyInput>
    /**
     * Filter which CorsairEvents to update
     */
    where?: CorsairEventWhereInput
    /**
     * Limit how many CorsairEvents to update.
     */
    limit?: number
  }

  /**
   * CorsairEvent updateManyAndReturn
   */
  export type CorsairEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * The data used to update CorsairEvents.
     */
    data: XOR<CorsairEventUpdateManyMutationInput, CorsairEventUncheckedUpdateManyInput>
    /**
     * Filter which CorsairEvents to update
     */
    where?: CorsairEventWhereInput
    /**
     * Limit how many CorsairEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CorsairEvent upsert
   */
  export type CorsairEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * The filter to search for the CorsairEvent to update in case it exists.
     */
    where: CorsairEventWhereUniqueInput
    /**
     * In case the CorsairEvent found by the `where` argument doesn't exist, create a new CorsairEvent with this data.
     */
    create: XOR<CorsairEventCreateInput, CorsairEventUncheckedCreateInput>
    /**
     * In case the CorsairEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CorsairEventUpdateInput, CorsairEventUncheckedUpdateInput>
  }

  /**
   * CorsairEvent delete
   */
  export type CorsairEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
    /**
     * Filter which CorsairEvent to delete.
     */
    where: CorsairEventWhereUniqueInput
  }

  /**
   * CorsairEvent deleteMany
   */
  export type CorsairEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorsairEvents to delete
     */
    where?: CorsairEventWhereInput
    /**
     * Limit how many CorsairEvents to delete.
     */
    limit?: number
  }

  /**
   * CorsairEvent without action
   */
  export type CorsairEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorsairEvent
     */
    select?: CorsairEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorsairEvent
     */
    omit?: CorsairEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CorsairEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CorsairIntegrationScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    config: 'config',
    dek: 'dek'
  };

  export type CorsairIntegrationScalarFieldEnum = (typeof CorsairIntegrationScalarFieldEnum)[keyof typeof CorsairIntegrationScalarFieldEnum]


  export const CorsairAccountScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tenantId: 'tenantId',
    integrationId: 'integrationId',
    config: 'config',
    dek: 'dek'
  };

  export type CorsairAccountScalarFieldEnum = (typeof CorsairAccountScalarFieldEnum)[keyof typeof CorsairAccountScalarFieldEnum]


  export const CorsairEntityScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    accountId: 'accountId',
    entityId: 'entityId',
    entityType: 'entityType',
    version: 'version',
    data: 'data'
  };

  export type CorsairEntityScalarFieldEnum = (typeof CorsairEntityScalarFieldEnum)[keyof typeof CorsairEntityScalarFieldEnum]


  export const CorsairEventScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    accountId: 'accountId',
    eventType: 'eventType',
    payload: 'payload',
    status: 'status'
  };

  export type CorsairEventScalarFieldEnum = (typeof CorsairEventScalarFieldEnum)[keyof typeof CorsairEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type CorsairIntegrationWhereInput = {
    AND?: CorsairIntegrationWhereInput | CorsairIntegrationWhereInput[]
    OR?: CorsairIntegrationWhereInput[]
    NOT?: CorsairIntegrationWhereInput | CorsairIntegrationWhereInput[]
    id?: StringFilter<"CorsairIntegration"> | string
    createdAt?: DateTimeFilter<"CorsairIntegration"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairIntegration"> | Date | string
    name?: StringFilter<"CorsairIntegration"> | string
    config?: JsonFilter<"CorsairIntegration">
    dek?: StringNullableFilter<"CorsairIntegration"> | string | null
    accounts?: CorsairAccountListRelationFilter
  }

  export type CorsairIntegrationOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    config?: SortOrder
    dek?: SortOrderInput | SortOrder
    accounts?: CorsairAccountOrderByRelationAggregateInput
  }

  export type CorsairIntegrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CorsairIntegrationWhereInput | CorsairIntegrationWhereInput[]
    OR?: CorsairIntegrationWhereInput[]
    NOT?: CorsairIntegrationWhereInput | CorsairIntegrationWhereInput[]
    createdAt?: DateTimeFilter<"CorsairIntegration"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairIntegration"> | Date | string
    name?: StringFilter<"CorsairIntegration"> | string
    config?: JsonFilter<"CorsairIntegration">
    dek?: StringNullableFilter<"CorsairIntegration"> | string | null
    accounts?: CorsairAccountListRelationFilter
  }, "id">

  export type CorsairIntegrationOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    config?: SortOrder
    dek?: SortOrderInput | SortOrder
    _count?: CorsairIntegrationCountOrderByAggregateInput
    _max?: CorsairIntegrationMaxOrderByAggregateInput
    _min?: CorsairIntegrationMinOrderByAggregateInput
  }

  export type CorsairIntegrationScalarWhereWithAggregatesInput = {
    AND?: CorsairIntegrationScalarWhereWithAggregatesInput | CorsairIntegrationScalarWhereWithAggregatesInput[]
    OR?: CorsairIntegrationScalarWhereWithAggregatesInput[]
    NOT?: CorsairIntegrationScalarWhereWithAggregatesInput | CorsairIntegrationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CorsairIntegration"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CorsairIntegration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CorsairIntegration"> | Date | string
    name?: StringWithAggregatesFilter<"CorsairIntegration"> | string
    config?: JsonWithAggregatesFilter<"CorsairIntegration">
    dek?: StringNullableWithAggregatesFilter<"CorsairIntegration"> | string | null
  }

  export type CorsairAccountWhereInput = {
    AND?: CorsairAccountWhereInput | CorsairAccountWhereInput[]
    OR?: CorsairAccountWhereInput[]
    NOT?: CorsairAccountWhereInput | CorsairAccountWhereInput[]
    id?: StringFilter<"CorsairAccount"> | string
    createdAt?: DateTimeFilter<"CorsairAccount"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairAccount"> | Date | string
    tenantId?: StringFilter<"CorsairAccount"> | string
    integrationId?: StringFilter<"CorsairAccount"> | string
    config?: JsonFilter<"CorsairAccount">
    dek?: StringNullableFilter<"CorsairAccount"> | string | null
    integration?: XOR<CorsairIntegrationScalarRelationFilter, CorsairIntegrationWhereInput>
    entities?: CorsairEntityListRelationFilter
    events?: CorsairEventListRelationFilter
  }

  export type CorsairAccountOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    integrationId?: SortOrder
    config?: SortOrder
    dek?: SortOrderInput | SortOrder
    integration?: CorsairIntegrationOrderByWithRelationInput
    entities?: CorsairEntityOrderByRelationAggregateInput
    events?: CorsairEventOrderByRelationAggregateInput
  }

  export type CorsairAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CorsairAccountWhereInput | CorsairAccountWhereInput[]
    OR?: CorsairAccountWhereInput[]
    NOT?: CorsairAccountWhereInput | CorsairAccountWhereInput[]
    createdAt?: DateTimeFilter<"CorsairAccount"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairAccount"> | Date | string
    tenantId?: StringFilter<"CorsairAccount"> | string
    integrationId?: StringFilter<"CorsairAccount"> | string
    config?: JsonFilter<"CorsairAccount">
    dek?: StringNullableFilter<"CorsairAccount"> | string | null
    integration?: XOR<CorsairIntegrationScalarRelationFilter, CorsairIntegrationWhereInput>
    entities?: CorsairEntityListRelationFilter
    events?: CorsairEventListRelationFilter
  }, "id">

  export type CorsairAccountOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    integrationId?: SortOrder
    config?: SortOrder
    dek?: SortOrderInput | SortOrder
    _count?: CorsairAccountCountOrderByAggregateInput
    _max?: CorsairAccountMaxOrderByAggregateInput
    _min?: CorsairAccountMinOrderByAggregateInput
  }

  export type CorsairAccountScalarWhereWithAggregatesInput = {
    AND?: CorsairAccountScalarWhereWithAggregatesInput | CorsairAccountScalarWhereWithAggregatesInput[]
    OR?: CorsairAccountScalarWhereWithAggregatesInput[]
    NOT?: CorsairAccountScalarWhereWithAggregatesInput | CorsairAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CorsairAccount"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CorsairAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CorsairAccount"> | Date | string
    tenantId?: StringWithAggregatesFilter<"CorsairAccount"> | string
    integrationId?: StringWithAggregatesFilter<"CorsairAccount"> | string
    config?: JsonWithAggregatesFilter<"CorsairAccount">
    dek?: StringNullableWithAggregatesFilter<"CorsairAccount"> | string | null
  }

  export type CorsairEntityWhereInput = {
    AND?: CorsairEntityWhereInput | CorsairEntityWhereInput[]
    OR?: CorsairEntityWhereInput[]
    NOT?: CorsairEntityWhereInput | CorsairEntityWhereInput[]
    id?: StringFilter<"CorsairEntity"> | string
    createdAt?: DateTimeFilter<"CorsairEntity"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairEntity"> | Date | string
    accountId?: StringFilter<"CorsairEntity"> | string
    entityId?: StringFilter<"CorsairEntity"> | string
    entityType?: StringFilter<"CorsairEntity"> | string
    version?: StringFilter<"CorsairEntity"> | string
    data?: JsonFilter<"CorsairEntity">
    account?: XOR<CorsairAccountScalarRelationFilter, CorsairAccountWhereInput>
  }

  export type CorsairEntityOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    version?: SortOrder
    data?: SortOrder
    account?: CorsairAccountOrderByWithRelationInput
  }

  export type CorsairEntityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CorsairEntityWhereInput | CorsairEntityWhereInput[]
    OR?: CorsairEntityWhereInput[]
    NOT?: CorsairEntityWhereInput | CorsairEntityWhereInput[]
    createdAt?: DateTimeFilter<"CorsairEntity"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairEntity"> | Date | string
    accountId?: StringFilter<"CorsairEntity"> | string
    entityId?: StringFilter<"CorsairEntity"> | string
    entityType?: StringFilter<"CorsairEntity"> | string
    version?: StringFilter<"CorsairEntity"> | string
    data?: JsonFilter<"CorsairEntity">
    account?: XOR<CorsairAccountScalarRelationFilter, CorsairAccountWhereInput>
  }, "id">

  export type CorsairEntityOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    version?: SortOrder
    data?: SortOrder
    _count?: CorsairEntityCountOrderByAggregateInput
    _max?: CorsairEntityMaxOrderByAggregateInput
    _min?: CorsairEntityMinOrderByAggregateInput
  }

  export type CorsairEntityScalarWhereWithAggregatesInput = {
    AND?: CorsairEntityScalarWhereWithAggregatesInput | CorsairEntityScalarWhereWithAggregatesInput[]
    OR?: CorsairEntityScalarWhereWithAggregatesInput[]
    NOT?: CorsairEntityScalarWhereWithAggregatesInput | CorsairEntityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CorsairEntity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CorsairEntity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CorsairEntity"> | Date | string
    accountId?: StringWithAggregatesFilter<"CorsairEntity"> | string
    entityId?: StringWithAggregatesFilter<"CorsairEntity"> | string
    entityType?: StringWithAggregatesFilter<"CorsairEntity"> | string
    version?: StringWithAggregatesFilter<"CorsairEntity"> | string
    data?: JsonWithAggregatesFilter<"CorsairEntity">
  }

  export type CorsairEventWhereInput = {
    AND?: CorsairEventWhereInput | CorsairEventWhereInput[]
    OR?: CorsairEventWhereInput[]
    NOT?: CorsairEventWhereInput | CorsairEventWhereInput[]
    id?: StringFilter<"CorsairEvent"> | string
    createdAt?: DateTimeFilter<"CorsairEvent"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairEvent"> | Date | string
    accountId?: StringFilter<"CorsairEvent"> | string
    eventType?: StringFilter<"CorsairEvent"> | string
    payload?: JsonFilter<"CorsairEvent">
    status?: StringNullableFilter<"CorsairEvent"> | string | null
    account?: XOR<CorsairAccountScalarRelationFilter, CorsairAccountWhereInput>
  }

  export type CorsairEventOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrderInput | SortOrder
    account?: CorsairAccountOrderByWithRelationInput
  }

  export type CorsairEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CorsairEventWhereInput | CorsairEventWhereInput[]
    OR?: CorsairEventWhereInput[]
    NOT?: CorsairEventWhereInput | CorsairEventWhereInput[]
    createdAt?: DateTimeFilter<"CorsairEvent"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairEvent"> | Date | string
    accountId?: StringFilter<"CorsairEvent"> | string
    eventType?: StringFilter<"CorsairEvent"> | string
    payload?: JsonFilter<"CorsairEvent">
    status?: StringNullableFilter<"CorsairEvent"> | string | null
    account?: XOR<CorsairAccountScalarRelationFilter, CorsairAccountWhereInput>
  }, "id">

  export type CorsairEventOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrderInput | SortOrder
    _count?: CorsairEventCountOrderByAggregateInput
    _max?: CorsairEventMaxOrderByAggregateInput
    _min?: CorsairEventMinOrderByAggregateInput
  }

  export type CorsairEventScalarWhereWithAggregatesInput = {
    AND?: CorsairEventScalarWhereWithAggregatesInput | CorsairEventScalarWhereWithAggregatesInput[]
    OR?: CorsairEventScalarWhereWithAggregatesInput[]
    NOT?: CorsairEventScalarWhereWithAggregatesInput | CorsairEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CorsairEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CorsairEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CorsairEvent"> | Date | string
    accountId?: StringWithAggregatesFilter<"CorsairEvent"> | string
    eventType?: StringWithAggregatesFilter<"CorsairEvent"> | string
    payload?: JsonWithAggregatesFilter<"CorsairEvent">
    status?: StringNullableWithAggregatesFilter<"CorsairEvent"> | string | null
  }

  export type CorsairIntegrationCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    accounts?: CorsairAccountCreateNestedManyWithoutIntegrationInput
  }

  export type CorsairIntegrationUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    accounts?: CorsairAccountUncheckedCreateNestedManyWithoutIntegrationInput
  }

  export type CorsairIntegrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: CorsairAccountUpdateManyWithoutIntegrationNestedInput
  }

  export type CorsairIntegrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: CorsairAccountUncheckedUpdateManyWithoutIntegrationNestedInput
  }

  export type CorsairIntegrationCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
  }

  export type CorsairIntegrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairIntegrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairAccountCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    integration: CorsairIntegrationCreateNestedOneWithoutAccountsInput
    entities?: CorsairEntityCreateNestedManyWithoutAccountInput
    events?: CorsairEventCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    integrationId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    entities?: CorsairEntityUncheckedCreateNestedManyWithoutAccountInput
    events?: CorsairEventUncheckedCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    integration?: CorsairIntegrationUpdateOneRequiredWithoutAccountsNestedInput
    entities?: CorsairEntityUpdateManyWithoutAccountNestedInput
    events?: CorsairEventUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    integrationId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: CorsairEntityUncheckedUpdateManyWithoutAccountNestedInput
    events?: CorsairEventUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    integrationId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
  }

  export type CorsairAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    integrationId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEntityCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    entityId: string
    entityType: string
    version: string
    data?: JsonNullValueInput | InputJsonValue
    account: CorsairAccountCreateNestedOneWithoutEntitiesInput
  }

  export type CorsairEntityUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    entityId: string
    entityType: string
    version: string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    account?: CorsairAccountUpdateOneRequiredWithoutEntitiesNestedInput
  }

  export type CorsairEntityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    entityId: string
    entityType: string
    version: string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEventCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    status?: string | null
    account: CorsairAccountCreateNestedOneWithoutEventsInput
  }

  export type CorsairEventUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    status?: string | null
  }

  export type CorsairEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
    account?: CorsairAccountUpdateOneRequiredWithoutEventsNestedInput
  }

  export type CorsairEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEventCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    status?: string | null
  }

  export type CorsairEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type CorsairAccountListRelationFilter = {
    every?: CorsairAccountWhereInput
    some?: CorsairAccountWhereInput
    none?: CorsairAccountWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CorsairAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CorsairIntegrationCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    config?: SortOrder
    dek?: SortOrder
  }

  export type CorsairIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    dek?: SortOrder
  }

  export type CorsairIntegrationMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    dek?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type CorsairIntegrationScalarRelationFilter = {
    is?: CorsairIntegrationWhereInput
    isNot?: CorsairIntegrationWhereInput
  }

  export type CorsairEntityListRelationFilter = {
    every?: CorsairEntityWhereInput
    some?: CorsairEntityWhereInput
    none?: CorsairEntityWhereInput
  }

  export type CorsairEventListRelationFilter = {
    every?: CorsairEventWhereInput
    some?: CorsairEventWhereInput
    none?: CorsairEventWhereInput
  }

  export type CorsairEntityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CorsairEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CorsairAccountCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    integrationId?: SortOrder
    config?: SortOrder
    dek?: SortOrder
  }

  export type CorsairAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    integrationId?: SortOrder
    dek?: SortOrder
  }

  export type CorsairAccountMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    integrationId?: SortOrder
    dek?: SortOrder
  }

  export type CorsairAccountScalarRelationFilter = {
    is?: CorsairAccountWhereInput
    isNot?: CorsairAccountWhereInput
  }

  export type CorsairEntityCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    version?: SortOrder
    data?: SortOrder
  }

  export type CorsairEntityMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    version?: SortOrder
  }

  export type CorsairEntityMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    version?: SortOrder
  }

  export type CorsairEventCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrder
  }

  export type CorsairEventMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    eventType?: SortOrder
    status?: SortOrder
  }

  export type CorsairEventMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    eventType?: SortOrder
    status?: SortOrder
  }

  export type CorsairAccountCreateNestedManyWithoutIntegrationInput = {
    create?: XOR<CorsairAccountCreateWithoutIntegrationInput, CorsairAccountUncheckedCreateWithoutIntegrationInput> | CorsairAccountCreateWithoutIntegrationInput[] | CorsairAccountUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutIntegrationInput | CorsairAccountCreateOrConnectWithoutIntegrationInput[]
    createMany?: CorsairAccountCreateManyIntegrationInputEnvelope
    connect?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
  }

  export type CorsairAccountUncheckedCreateNestedManyWithoutIntegrationInput = {
    create?: XOR<CorsairAccountCreateWithoutIntegrationInput, CorsairAccountUncheckedCreateWithoutIntegrationInput> | CorsairAccountCreateWithoutIntegrationInput[] | CorsairAccountUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutIntegrationInput | CorsairAccountCreateOrConnectWithoutIntegrationInput[]
    createMany?: CorsairAccountCreateManyIntegrationInputEnvelope
    connect?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type CorsairAccountUpdateManyWithoutIntegrationNestedInput = {
    create?: XOR<CorsairAccountCreateWithoutIntegrationInput, CorsairAccountUncheckedCreateWithoutIntegrationInput> | CorsairAccountCreateWithoutIntegrationInput[] | CorsairAccountUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutIntegrationInput | CorsairAccountCreateOrConnectWithoutIntegrationInput[]
    upsert?: CorsairAccountUpsertWithWhereUniqueWithoutIntegrationInput | CorsairAccountUpsertWithWhereUniqueWithoutIntegrationInput[]
    createMany?: CorsairAccountCreateManyIntegrationInputEnvelope
    set?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    disconnect?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    delete?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    connect?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    update?: CorsairAccountUpdateWithWhereUniqueWithoutIntegrationInput | CorsairAccountUpdateWithWhereUniqueWithoutIntegrationInput[]
    updateMany?: CorsairAccountUpdateManyWithWhereWithoutIntegrationInput | CorsairAccountUpdateManyWithWhereWithoutIntegrationInput[]
    deleteMany?: CorsairAccountScalarWhereInput | CorsairAccountScalarWhereInput[]
  }

  export type CorsairAccountUncheckedUpdateManyWithoutIntegrationNestedInput = {
    create?: XOR<CorsairAccountCreateWithoutIntegrationInput, CorsairAccountUncheckedCreateWithoutIntegrationInput> | CorsairAccountCreateWithoutIntegrationInput[] | CorsairAccountUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutIntegrationInput | CorsairAccountCreateOrConnectWithoutIntegrationInput[]
    upsert?: CorsairAccountUpsertWithWhereUniqueWithoutIntegrationInput | CorsairAccountUpsertWithWhereUniqueWithoutIntegrationInput[]
    createMany?: CorsairAccountCreateManyIntegrationInputEnvelope
    set?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    disconnect?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    delete?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    connect?: CorsairAccountWhereUniqueInput | CorsairAccountWhereUniqueInput[]
    update?: CorsairAccountUpdateWithWhereUniqueWithoutIntegrationInput | CorsairAccountUpdateWithWhereUniqueWithoutIntegrationInput[]
    updateMany?: CorsairAccountUpdateManyWithWhereWithoutIntegrationInput | CorsairAccountUpdateManyWithWhereWithoutIntegrationInput[]
    deleteMany?: CorsairAccountScalarWhereInput | CorsairAccountScalarWhereInput[]
  }

  export type CorsairIntegrationCreateNestedOneWithoutAccountsInput = {
    create?: XOR<CorsairIntegrationCreateWithoutAccountsInput, CorsairIntegrationUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: CorsairIntegrationCreateOrConnectWithoutAccountsInput
    connect?: CorsairIntegrationWhereUniqueInput
  }

  export type CorsairEntityCreateNestedManyWithoutAccountInput = {
    create?: XOR<CorsairEntityCreateWithoutAccountInput, CorsairEntityUncheckedCreateWithoutAccountInput> | CorsairEntityCreateWithoutAccountInput[] | CorsairEntityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEntityCreateOrConnectWithoutAccountInput | CorsairEntityCreateOrConnectWithoutAccountInput[]
    createMany?: CorsairEntityCreateManyAccountInputEnvelope
    connect?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
  }

  export type CorsairEventCreateNestedManyWithoutAccountInput = {
    create?: XOR<CorsairEventCreateWithoutAccountInput, CorsairEventUncheckedCreateWithoutAccountInput> | CorsairEventCreateWithoutAccountInput[] | CorsairEventUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEventCreateOrConnectWithoutAccountInput | CorsairEventCreateOrConnectWithoutAccountInput[]
    createMany?: CorsairEventCreateManyAccountInputEnvelope
    connect?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
  }

  export type CorsairEntityUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<CorsairEntityCreateWithoutAccountInput, CorsairEntityUncheckedCreateWithoutAccountInput> | CorsairEntityCreateWithoutAccountInput[] | CorsairEntityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEntityCreateOrConnectWithoutAccountInput | CorsairEntityCreateOrConnectWithoutAccountInput[]
    createMany?: CorsairEntityCreateManyAccountInputEnvelope
    connect?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
  }

  export type CorsairEventUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<CorsairEventCreateWithoutAccountInput, CorsairEventUncheckedCreateWithoutAccountInput> | CorsairEventCreateWithoutAccountInput[] | CorsairEventUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEventCreateOrConnectWithoutAccountInput | CorsairEventCreateOrConnectWithoutAccountInput[]
    createMany?: CorsairEventCreateManyAccountInputEnvelope
    connect?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
  }

  export type CorsairIntegrationUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<CorsairIntegrationCreateWithoutAccountsInput, CorsairIntegrationUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: CorsairIntegrationCreateOrConnectWithoutAccountsInput
    upsert?: CorsairIntegrationUpsertWithoutAccountsInput
    connect?: CorsairIntegrationWhereUniqueInput
    update?: XOR<XOR<CorsairIntegrationUpdateToOneWithWhereWithoutAccountsInput, CorsairIntegrationUpdateWithoutAccountsInput>, CorsairIntegrationUncheckedUpdateWithoutAccountsInput>
  }

  export type CorsairEntityUpdateManyWithoutAccountNestedInput = {
    create?: XOR<CorsairEntityCreateWithoutAccountInput, CorsairEntityUncheckedCreateWithoutAccountInput> | CorsairEntityCreateWithoutAccountInput[] | CorsairEntityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEntityCreateOrConnectWithoutAccountInput | CorsairEntityCreateOrConnectWithoutAccountInput[]
    upsert?: CorsairEntityUpsertWithWhereUniqueWithoutAccountInput | CorsairEntityUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: CorsairEntityCreateManyAccountInputEnvelope
    set?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    disconnect?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    delete?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    connect?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    update?: CorsairEntityUpdateWithWhereUniqueWithoutAccountInput | CorsairEntityUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: CorsairEntityUpdateManyWithWhereWithoutAccountInput | CorsairEntityUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: CorsairEntityScalarWhereInput | CorsairEntityScalarWhereInput[]
  }

  export type CorsairEventUpdateManyWithoutAccountNestedInput = {
    create?: XOR<CorsairEventCreateWithoutAccountInput, CorsairEventUncheckedCreateWithoutAccountInput> | CorsairEventCreateWithoutAccountInput[] | CorsairEventUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEventCreateOrConnectWithoutAccountInput | CorsairEventCreateOrConnectWithoutAccountInput[]
    upsert?: CorsairEventUpsertWithWhereUniqueWithoutAccountInput | CorsairEventUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: CorsairEventCreateManyAccountInputEnvelope
    set?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    disconnect?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    delete?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    connect?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    update?: CorsairEventUpdateWithWhereUniqueWithoutAccountInput | CorsairEventUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: CorsairEventUpdateManyWithWhereWithoutAccountInput | CorsairEventUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: CorsairEventScalarWhereInput | CorsairEventScalarWhereInput[]
  }

  export type CorsairEntityUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<CorsairEntityCreateWithoutAccountInput, CorsairEntityUncheckedCreateWithoutAccountInput> | CorsairEntityCreateWithoutAccountInput[] | CorsairEntityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEntityCreateOrConnectWithoutAccountInput | CorsairEntityCreateOrConnectWithoutAccountInput[]
    upsert?: CorsairEntityUpsertWithWhereUniqueWithoutAccountInput | CorsairEntityUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: CorsairEntityCreateManyAccountInputEnvelope
    set?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    disconnect?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    delete?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    connect?: CorsairEntityWhereUniqueInput | CorsairEntityWhereUniqueInput[]
    update?: CorsairEntityUpdateWithWhereUniqueWithoutAccountInput | CorsairEntityUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: CorsairEntityUpdateManyWithWhereWithoutAccountInput | CorsairEntityUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: CorsairEntityScalarWhereInput | CorsairEntityScalarWhereInput[]
  }

  export type CorsairEventUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<CorsairEventCreateWithoutAccountInput, CorsairEventUncheckedCreateWithoutAccountInput> | CorsairEventCreateWithoutAccountInput[] | CorsairEventUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: CorsairEventCreateOrConnectWithoutAccountInput | CorsairEventCreateOrConnectWithoutAccountInput[]
    upsert?: CorsairEventUpsertWithWhereUniqueWithoutAccountInput | CorsairEventUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: CorsairEventCreateManyAccountInputEnvelope
    set?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    disconnect?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    delete?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    connect?: CorsairEventWhereUniqueInput | CorsairEventWhereUniqueInput[]
    update?: CorsairEventUpdateWithWhereUniqueWithoutAccountInput | CorsairEventUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: CorsairEventUpdateManyWithWhereWithoutAccountInput | CorsairEventUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: CorsairEventScalarWhereInput | CorsairEventScalarWhereInput[]
  }

  export type CorsairAccountCreateNestedOneWithoutEntitiesInput = {
    create?: XOR<CorsairAccountCreateWithoutEntitiesInput, CorsairAccountUncheckedCreateWithoutEntitiesInput>
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutEntitiesInput
    connect?: CorsairAccountWhereUniqueInput
  }

  export type CorsairAccountUpdateOneRequiredWithoutEntitiesNestedInput = {
    create?: XOR<CorsairAccountCreateWithoutEntitiesInput, CorsairAccountUncheckedCreateWithoutEntitiesInput>
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutEntitiesInput
    upsert?: CorsairAccountUpsertWithoutEntitiesInput
    connect?: CorsairAccountWhereUniqueInput
    update?: XOR<XOR<CorsairAccountUpdateToOneWithWhereWithoutEntitiesInput, CorsairAccountUpdateWithoutEntitiesInput>, CorsairAccountUncheckedUpdateWithoutEntitiesInput>
  }

  export type CorsairAccountCreateNestedOneWithoutEventsInput = {
    create?: XOR<CorsairAccountCreateWithoutEventsInput, CorsairAccountUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutEventsInput
    connect?: CorsairAccountWhereUniqueInput
  }

  export type CorsairAccountUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<CorsairAccountCreateWithoutEventsInput, CorsairAccountUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CorsairAccountCreateOrConnectWithoutEventsInput
    upsert?: CorsairAccountUpsertWithoutEventsInput
    connect?: CorsairAccountWhereUniqueInput
    update?: XOR<XOR<CorsairAccountUpdateToOneWithWhereWithoutEventsInput, CorsairAccountUpdateWithoutEventsInput>, CorsairAccountUncheckedUpdateWithoutEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CorsairAccountCreateWithoutIntegrationInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    entities?: CorsairEntityCreateNestedManyWithoutAccountInput
    events?: CorsairEventCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountUncheckedCreateWithoutIntegrationInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    entities?: CorsairEntityUncheckedCreateNestedManyWithoutAccountInput
    events?: CorsairEventUncheckedCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountCreateOrConnectWithoutIntegrationInput = {
    where: CorsairAccountWhereUniqueInput
    create: XOR<CorsairAccountCreateWithoutIntegrationInput, CorsairAccountUncheckedCreateWithoutIntegrationInput>
  }

  export type CorsairAccountCreateManyIntegrationInputEnvelope = {
    data: CorsairAccountCreateManyIntegrationInput | CorsairAccountCreateManyIntegrationInput[]
    skipDuplicates?: boolean
  }

  export type CorsairAccountUpsertWithWhereUniqueWithoutIntegrationInput = {
    where: CorsairAccountWhereUniqueInput
    update: XOR<CorsairAccountUpdateWithoutIntegrationInput, CorsairAccountUncheckedUpdateWithoutIntegrationInput>
    create: XOR<CorsairAccountCreateWithoutIntegrationInput, CorsairAccountUncheckedCreateWithoutIntegrationInput>
  }

  export type CorsairAccountUpdateWithWhereUniqueWithoutIntegrationInput = {
    where: CorsairAccountWhereUniqueInput
    data: XOR<CorsairAccountUpdateWithoutIntegrationInput, CorsairAccountUncheckedUpdateWithoutIntegrationInput>
  }

  export type CorsairAccountUpdateManyWithWhereWithoutIntegrationInput = {
    where: CorsairAccountScalarWhereInput
    data: XOR<CorsairAccountUpdateManyMutationInput, CorsairAccountUncheckedUpdateManyWithoutIntegrationInput>
  }

  export type CorsairAccountScalarWhereInput = {
    AND?: CorsairAccountScalarWhereInput | CorsairAccountScalarWhereInput[]
    OR?: CorsairAccountScalarWhereInput[]
    NOT?: CorsairAccountScalarWhereInput | CorsairAccountScalarWhereInput[]
    id?: StringFilter<"CorsairAccount"> | string
    createdAt?: DateTimeFilter<"CorsairAccount"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairAccount"> | Date | string
    tenantId?: StringFilter<"CorsairAccount"> | string
    integrationId?: StringFilter<"CorsairAccount"> | string
    config?: JsonFilter<"CorsairAccount">
    dek?: StringNullableFilter<"CorsairAccount"> | string | null
  }

  export type CorsairIntegrationCreateWithoutAccountsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
  }

  export type CorsairIntegrationUncheckedCreateWithoutAccountsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
  }

  export type CorsairIntegrationCreateOrConnectWithoutAccountsInput = {
    where: CorsairIntegrationWhereUniqueInput
    create: XOR<CorsairIntegrationCreateWithoutAccountsInput, CorsairIntegrationUncheckedCreateWithoutAccountsInput>
  }

  export type CorsairEntityCreateWithoutAccountInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    entityId: string
    entityType: string
    version: string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityUncheckedCreateWithoutAccountInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    entityId: string
    entityType: string
    version: string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityCreateOrConnectWithoutAccountInput = {
    where: CorsairEntityWhereUniqueInput
    create: XOR<CorsairEntityCreateWithoutAccountInput, CorsairEntityUncheckedCreateWithoutAccountInput>
  }

  export type CorsairEntityCreateManyAccountInputEnvelope = {
    data: CorsairEntityCreateManyAccountInput | CorsairEntityCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type CorsairEventCreateWithoutAccountInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    status?: string | null
  }

  export type CorsairEventUncheckedCreateWithoutAccountInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    status?: string | null
  }

  export type CorsairEventCreateOrConnectWithoutAccountInput = {
    where: CorsairEventWhereUniqueInput
    create: XOR<CorsairEventCreateWithoutAccountInput, CorsairEventUncheckedCreateWithoutAccountInput>
  }

  export type CorsairEventCreateManyAccountInputEnvelope = {
    data: CorsairEventCreateManyAccountInput | CorsairEventCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type CorsairIntegrationUpsertWithoutAccountsInput = {
    update: XOR<CorsairIntegrationUpdateWithoutAccountsInput, CorsairIntegrationUncheckedUpdateWithoutAccountsInput>
    create: XOR<CorsairIntegrationCreateWithoutAccountsInput, CorsairIntegrationUncheckedCreateWithoutAccountsInput>
    where?: CorsairIntegrationWhereInput
  }

  export type CorsairIntegrationUpdateToOneWithWhereWithoutAccountsInput = {
    where?: CorsairIntegrationWhereInput
    data: XOR<CorsairIntegrationUpdateWithoutAccountsInput, CorsairIntegrationUncheckedUpdateWithoutAccountsInput>
  }

  export type CorsairIntegrationUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairIntegrationUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEntityUpsertWithWhereUniqueWithoutAccountInput = {
    where: CorsairEntityWhereUniqueInput
    update: XOR<CorsairEntityUpdateWithoutAccountInput, CorsairEntityUncheckedUpdateWithoutAccountInput>
    create: XOR<CorsairEntityCreateWithoutAccountInput, CorsairEntityUncheckedCreateWithoutAccountInput>
  }

  export type CorsairEntityUpdateWithWhereUniqueWithoutAccountInput = {
    where: CorsairEntityWhereUniqueInput
    data: XOR<CorsairEntityUpdateWithoutAccountInput, CorsairEntityUncheckedUpdateWithoutAccountInput>
  }

  export type CorsairEntityUpdateManyWithWhereWithoutAccountInput = {
    where: CorsairEntityScalarWhereInput
    data: XOR<CorsairEntityUpdateManyMutationInput, CorsairEntityUncheckedUpdateManyWithoutAccountInput>
  }

  export type CorsairEntityScalarWhereInput = {
    AND?: CorsairEntityScalarWhereInput | CorsairEntityScalarWhereInput[]
    OR?: CorsairEntityScalarWhereInput[]
    NOT?: CorsairEntityScalarWhereInput | CorsairEntityScalarWhereInput[]
    id?: StringFilter<"CorsairEntity"> | string
    createdAt?: DateTimeFilter<"CorsairEntity"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairEntity"> | Date | string
    accountId?: StringFilter<"CorsairEntity"> | string
    entityId?: StringFilter<"CorsairEntity"> | string
    entityType?: StringFilter<"CorsairEntity"> | string
    version?: StringFilter<"CorsairEntity"> | string
    data?: JsonFilter<"CorsairEntity">
  }

  export type CorsairEventUpsertWithWhereUniqueWithoutAccountInput = {
    where: CorsairEventWhereUniqueInput
    update: XOR<CorsairEventUpdateWithoutAccountInput, CorsairEventUncheckedUpdateWithoutAccountInput>
    create: XOR<CorsairEventCreateWithoutAccountInput, CorsairEventUncheckedCreateWithoutAccountInput>
  }

  export type CorsairEventUpdateWithWhereUniqueWithoutAccountInput = {
    where: CorsairEventWhereUniqueInput
    data: XOR<CorsairEventUpdateWithoutAccountInput, CorsairEventUncheckedUpdateWithoutAccountInput>
  }

  export type CorsairEventUpdateManyWithWhereWithoutAccountInput = {
    where: CorsairEventScalarWhereInput
    data: XOR<CorsairEventUpdateManyMutationInput, CorsairEventUncheckedUpdateManyWithoutAccountInput>
  }

  export type CorsairEventScalarWhereInput = {
    AND?: CorsairEventScalarWhereInput | CorsairEventScalarWhereInput[]
    OR?: CorsairEventScalarWhereInput[]
    NOT?: CorsairEventScalarWhereInput | CorsairEventScalarWhereInput[]
    id?: StringFilter<"CorsairEvent"> | string
    createdAt?: DateTimeFilter<"CorsairEvent"> | Date | string
    updatedAt?: DateTimeFilter<"CorsairEvent"> | Date | string
    accountId?: StringFilter<"CorsairEvent"> | string
    eventType?: StringFilter<"CorsairEvent"> | string
    payload?: JsonFilter<"CorsairEvent">
    status?: StringNullableFilter<"CorsairEvent"> | string | null
  }

  export type CorsairAccountCreateWithoutEntitiesInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    integration: CorsairIntegrationCreateNestedOneWithoutAccountsInput
    events?: CorsairEventCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountUncheckedCreateWithoutEntitiesInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    integrationId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    events?: CorsairEventUncheckedCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountCreateOrConnectWithoutEntitiesInput = {
    where: CorsairAccountWhereUniqueInput
    create: XOR<CorsairAccountCreateWithoutEntitiesInput, CorsairAccountUncheckedCreateWithoutEntitiesInput>
  }

  export type CorsairAccountUpsertWithoutEntitiesInput = {
    update: XOR<CorsairAccountUpdateWithoutEntitiesInput, CorsairAccountUncheckedUpdateWithoutEntitiesInput>
    create: XOR<CorsairAccountCreateWithoutEntitiesInput, CorsairAccountUncheckedCreateWithoutEntitiesInput>
    where?: CorsairAccountWhereInput
  }

  export type CorsairAccountUpdateToOneWithWhereWithoutEntitiesInput = {
    where?: CorsairAccountWhereInput
    data: XOR<CorsairAccountUpdateWithoutEntitiesInput, CorsairAccountUncheckedUpdateWithoutEntitiesInput>
  }

  export type CorsairAccountUpdateWithoutEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    integration?: CorsairIntegrationUpdateOneRequiredWithoutAccountsNestedInput
    events?: CorsairEventUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountUncheckedUpdateWithoutEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    integrationId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    events?: CorsairEventUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountCreateWithoutEventsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    integration: CorsairIntegrationCreateNestedOneWithoutAccountsInput
    entities?: CorsairEntityCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountUncheckedCreateWithoutEventsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    integrationId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
    entities?: CorsairEntityUncheckedCreateNestedManyWithoutAccountInput
  }

  export type CorsairAccountCreateOrConnectWithoutEventsInput = {
    where: CorsairAccountWhereUniqueInput
    create: XOR<CorsairAccountCreateWithoutEventsInput, CorsairAccountUncheckedCreateWithoutEventsInput>
  }

  export type CorsairAccountUpsertWithoutEventsInput = {
    update: XOR<CorsairAccountUpdateWithoutEventsInput, CorsairAccountUncheckedUpdateWithoutEventsInput>
    create: XOR<CorsairAccountCreateWithoutEventsInput, CorsairAccountUncheckedCreateWithoutEventsInput>
    where?: CorsairAccountWhereInput
  }

  export type CorsairAccountUpdateToOneWithWhereWithoutEventsInput = {
    where?: CorsairAccountWhereInput
    data: XOR<CorsairAccountUpdateWithoutEventsInput, CorsairAccountUncheckedUpdateWithoutEventsInput>
  }

  export type CorsairAccountUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    integration?: CorsairIntegrationUpdateOneRequiredWithoutAccountsNestedInput
    entities?: CorsairEntityUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    integrationId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: CorsairEntityUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountCreateManyIntegrationInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    config?: JsonNullValueInput | InputJsonValue
    dek?: string | null
  }

  export type CorsairAccountUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: CorsairEntityUpdateManyWithoutAccountNestedInput
    events?: CorsairEventUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountUncheckedUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: CorsairEntityUncheckedUpdateManyWithoutAccountNestedInput
    events?: CorsairEventUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type CorsairAccountUncheckedUpdateManyWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    dek?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEntityCreateManyAccountInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    entityId: string
    entityType: string
    version: string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEventCreateManyAccountInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    status?: string | null
  }

  export type CorsairEntityUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEntityUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type CorsairEventUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEventUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CorsairEventUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}