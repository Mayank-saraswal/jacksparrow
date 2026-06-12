
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ChannelLink
 * 
 */
export type ChannelLink = $Result.DefaultSelection<Prisma.$ChannelLinkPayload>
/**
 * Model EmailEmbedding
 * 
 */
export type EmailEmbedding = $Result.DefaultSelection<Prisma.$EmailEmbeddingPayload>
/**
 * Model PriorityScore
 * 
 */
export type PriorityScore = $Result.DefaultSelection<Prisma.$PriorityScorePayload>
/**
 * Model PendingAction
 * 
 */
export type PendingAction = $Result.DefaultSelection<Prisma.$PendingActionPayload>
/**
 * Model UserPreference
 * 
 */
export type UserPreference = $Result.DefaultSelection<Prisma.$UserPreferencePayload>
/**
 * Model SyncItem
 * 
 */
export type SyncItem = $Result.DefaultSelection<Prisma.$SyncItemPayload>

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

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.channelLink`: Exposes CRUD operations for the **ChannelLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChannelLinks
    * const channelLinks = await prisma.channelLink.findMany()
    * ```
    */
  get channelLink(): Prisma.ChannelLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.emailEmbedding`: Exposes CRUD operations for the **EmailEmbedding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailEmbeddings
    * const emailEmbeddings = await prisma.emailEmbedding.findMany()
    * ```
    */
  get emailEmbedding(): Prisma.EmailEmbeddingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.priorityScore`: Exposes CRUD operations for the **PriorityScore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriorityScores
    * const priorityScores = await prisma.priorityScore.findMany()
    * ```
    */
  get priorityScore(): Prisma.PriorityScoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pendingAction`: Exposes CRUD operations for the **PendingAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingActions
    * const pendingActions = await prisma.pendingAction.findMany()
    * ```
    */
  get pendingAction(): Prisma.PendingActionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPreference`: Exposes CRUD operations for the **UserPreference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPreferences
    * const userPreferences = await prisma.userPreference.findMany()
    * ```
    */
  get userPreference(): Prisma.UserPreferenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncItem`: Exposes CRUD operations for the **SyncItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncItems
    * const syncItems = await prisma.syncItem.findMany()
    * ```
    */
  get syncItem(): Prisma.SyncItemDelegate<ExtArgs, ClientOptions>;
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
    CorsairEvent: 'CorsairEvent',
    User: 'User',
    ChannelLink: 'ChannelLink',
    EmailEmbedding: 'EmailEmbedding',
    PriorityScore: 'PriorityScore',
    PendingAction: 'PendingAction',
    UserPreference: 'UserPreference',
    SyncItem: 'SyncItem'
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
      modelProps: "corsairIntegration" | "corsairAccount" | "corsairEntity" | "corsairEvent" | "user" | "channelLink" | "emailEmbedding" | "priorityScore" | "pendingAction" | "userPreference" | "syncItem"
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
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ChannelLink: {
        payload: Prisma.$ChannelLinkPayload<ExtArgs>
        fields: Prisma.ChannelLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChannelLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChannelLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>
          }
          findFirst: {
            args: Prisma.ChannelLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChannelLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>
          }
          findMany: {
            args: Prisma.ChannelLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>[]
          }
          create: {
            args: Prisma.ChannelLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>
          }
          createMany: {
            args: Prisma.ChannelLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChannelLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>[]
          }
          delete: {
            args: Prisma.ChannelLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>
          }
          update: {
            args: Prisma.ChannelLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>
          }
          deleteMany: {
            args: Prisma.ChannelLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChannelLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChannelLinkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>[]
          }
          upsert: {
            args: Prisma.ChannelLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChannelLinkPayload>
          }
          aggregate: {
            args: Prisma.ChannelLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChannelLink>
          }
          groupBy: {
            args: Prisma.ChannelLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChannelLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChannelLinkCountArgs<ExtArgs>
            result: $Utils.Optional<ChannelLinkCountAggregateOutputType> | number
          }
        }
      }
      EmailEmbedding: {
        payload: Prisma.$EmailEmbeddingPayload<ExtArgs>
        fields: Prisma.EmailEmbeddingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailEmbeddingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailEmbeddingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>
          }
          findFirst: {
            args: Prisma.EmailEmbeddingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailEmbeddingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>
          }
          findMany: {
            args: Prisma.EmailEmbeddingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>[]
          }
          create: {
            args: Prisma.EmailEmbeddingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>
          }
          createMany: {
            args: Prisma.EmailEmbeddingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailEmbeddingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>[]
          }
          delete: {
            args: Prisma.EmailEmbeddingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>
          }
          update: {
            args: Prisma.EmailEmbeddingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>
          }
          deleteMany: {
            args: Prisma.EmailEmbeddingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailEmbeddingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmailEmbeddingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>[]
          }
          upsert: {
            args: Prisma.EmailEmbeddingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailEmbeddingPayload>
          }
          aggregate: {
            args: Prisma.EmailEmbeddingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailEmbedding>
          }
          groupBy: {
            args: Prisma.EmailEmbeddingGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailEmbeddingGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailEmbeddingCountArgs<ExtArgs>
            result: $Utils.Optional<EmailEmbeddingCountAggregateOutputType> | number
          }
        }
      }
      PriorityScore: {
        payload: Prisma.$PriorityScorePayload<ExtArgs>
        fields: Prisma.PriorityScoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriorityScoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriorityScoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>
          }
          findFirst: {
            args: Prisma.PriorityScoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriorityScoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>
          }
          findMany: {
            args: Prisma.PriorityScoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>[]
          }
          create: {
            args: Prisma.PriorityScoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>
          }
          createMany: {
            args: Prisma.PriorityScoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriorityScoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>[]
          }
          delete: {
            args: Prisma.PriorityScoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>
          }
          update: {
            args: Prisma.PriorityScoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>
          }
          deleteMany: {
            args: Prisma.PriorityScoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriorityScoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PriorityScoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>[]
          }
          upsert: {
            args: Prisma.PriorityScoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityScorePayload>
          }
          aggregate: {
            args: Prisma.PriorityScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriorityScore>
          }
          groupBy: {
            args: Prisma.PriorityScoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriorityScoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriorityScoreCountArgs<ExtArgs>
            result: $Utils.Optional<PriorityScoreCountAggregateOutputType> | number
          }
        }
      }
      PendingAction: {
        payload: Prisma.$PendingActionPayload<ExtArgs>
        fields: Prisma.PendingActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>
          }
          findFirst: {
            args: Prisma.PendingActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>
          }
          findMany: {
            args: Prisma.PendingActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>[]
          }
          create: {
            args: Prisma.PendingActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>
          }
          createMany: {
            args: Prisma.PendingActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PendingActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>[]
          }
          delete: {
            args: Prisma.PendingActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>
          }
          update: {
            args: Prisma.PendingActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>
          }
          deleteMany: {
            args: Prisma.PendingActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PendingActionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>[]
          }
          upsert: {
            args: Prisma.PendingActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingActionPayload>
          }
          aggregate: {
            args: Prisma.PendingActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingAction>
          }
          groupBy: {
            args: Prisma.PendingActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PendingActionCountArgs<ExtArgs>
            result: $Utils.Optional<PendingActionCountAggregateOutputType> | number
          }
        }
      }
      UserPreference: {
        payload: Prisma.$UserPreferencePayload<ExtArgs>
        fields: Prisma.UserPreferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPreferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPreferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>
          }
          findFirst: {
            args: Prisma.UserPreferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPreferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>
          }
          findMany: {
            args: Prisma.UserPreferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>[]
          }
          create: {
            args: Prisma.UserPreferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>
          }
          createMany: {
            args: Prisma.UserPreferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPreferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>[]
          }
          delete: {
            args: Prisma.UserPreferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>
          }
          update: {
            args: Prisma.UserPreferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>
          }
          deleteMany: {
            args: Prisma.UserPreferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPreferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserPreferenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>[]
          }
          upsert: {
            args: Prisma.UserPreferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPreferencePayload>
          }
          aggregate: {
            args: Prisma.UserPreferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPreference>
          }
          groupBy: {
            args: Prisma.UserPreferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPreferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPreferenceCountArgs<ExtArgs>
            result: $Utils.Optional<UserPreferenceCountAggregateOutputType> | number
          }
        }
      }
      SyncItem: {
        payload: Prisma.$SyncItemPayload<ExtArgs>
        fields: Prisma.SyncItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>
          }
          findFirst: {
            args: Prisma.SyncItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>
          }
          findMany: {
            args: Prisma.SyncItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>[]
          }
          create: {
            args: Prisma.SyncItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>
          }
          createMany: {
            args: Prisma.SyncItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>[]
          }
          delete: {
            args: Prisma.SyncItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>
          }
          update: {
            args: Prisma.SyncItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>
          }
          deleteMany: {
            args: Prisma.SyncItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>[]
          }
          upsert: {
            args: Prisma.SyncItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncItemPayload>
          }
          aggregate: {
            args: Prisma.SyncItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncItem>
          }
          groupBy: {
            args: Prisma.SyncItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncItemCountArgs<ExtArgs>
            result: $Utils.Optional<SyncItemCountAggregateOutputType> | number
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
    user?: UserOmit
    channelLink?: ChannelLinkOmit
    emailEmbedding?: EmailEmbeddingOmit
    priorityScore?: PriorityScoreOmit
    pendingAction?: PendingActionOmit
    userPreference?: UserPreferenceOmit
    syncItem?: SyncItemOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    channelLinks: number
    emailEmbeddings: number
    priorityScores: number
    pendingActions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    channelLinks?: boolean | UserCountOutputTypeCountChannelLinksArgs
    emailEmbeddings?: boolean | UserCountOutputTypeCountEmailEmbeddingsArgs
    priorityScores?: boolean | UserCountOutputTypeCountPriorityScoresArgs
    pendingActions?: boolean | UserCountOutputTypeCountPendingActionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChannelLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChannelLinkWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEmailEmbeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailEmbeddingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPriorityScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriorityScoreWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPendingActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingActionWhereInput
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
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    gmailBackfilledAt: Date | null
    calendarBackfilledAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    gmailBackfilledAt: Date | null
    calendarBackfilledAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    gmailBackfilledAt: number
    calendarBackfilledAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    gmailBackfilledAt?: true
    calendarBackfilledAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    gmailBackfilledAt?: true
    calendarBackfilledAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    gmailBackfilledAt?: true
    calendarBackfilledAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    gmailBackfilledAt: Date | null
    calendarBackfilledAt: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gmailBackfilledAt?: boolean
    calendarBackfilledAt?: boolean
    channelLinks?: boolean | User$channelLinksArgs<ExtArgs>
    emailEmbeddings?: boolean | User$emailEmbeddingsArgs<ExtArgs>
    priorityScores?: boolean | User$priorityScoresArgs<ExtArgs>
    pendingActions?: boolean | User$pendingActionsArgs<ExtArgs>
    preference?: boolean | User$preferenceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gmailBackfilledAt?: boolean
    calendarBackfilledAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gmailBackfilledAt?: boolean
    calendarBackfilledAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gmailBackfilledAt?: boolean
    calendarBackfilledAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "gmailBackfilledAt" | "calendarBackfilledAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    channelLinks?: boolean | User$channelLinksArgs<ExtArgs>
    emailEmbeddings?: boolean | User$emailEmbeddingsArgs<ExtArgs>
    priorityScores?: boolean | User$priorityScoresArgs<ExtArgs>
    pendingActions?: boolean | User$pendingActionsArgs<ExtArgs>
    preference?: boolean | User$preferenceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      channelLinks: Prisma.$ChannelLinkPayload<ExtArgs>[]
      emailEmbeddings: Prisma.$EmailEmbeddingPayload<ExtArgs>[]
      priorityScores: Prisma.$PriorityScorePayload<ExtArgs>[]
      pendingActions: Prisma.$PendingActionPayload<ExtArgs>[]
      preference: Prisma.$UserPreferencePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      gmailBackfilledAt: Date | null
      calendarBackfilledAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    channelLinks<T extends User$channelLinksArgs<ExtArgs> = {}>(args?: Subset<T, User$channelLinksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    emailEmbeddings<T extends User$emailEmbeddingsArgs<ExtArgs> = {}>(args?: Subset<T, User$emailEmbeddingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    priorityScores<T extends User$priorityScoresArgs<ExtArgs> = {}>(args?: Subset<T, User$priorityScoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pendingActions<T extends User$pendingActionsArgs<ExtArgs> = {}>(args?: Subset<T, User$pendingActionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    preference<T extends User$preferenceArgs<ExtArgs> = {}>(args?: Subset<T, User$preferenceArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly gmailBackfilledAt: FieldRef<"User", 'DateTime'>
    readonly calendarBackfilledAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.channelLinks
   */
  export type User$channelLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    where?: ChannelLinkWhereInput
    orderBy?: ChannelLinkOrderByWithRelationInput | ChannelLinkOrderByWithRelationInput[]
    cursor?: ChannelLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChannelLinkScalarFieldEnum | ChannelLinkScalarFieldEnum[]
  }

  /**
   * User.emailEmbeddings
   */
  export type User$emailEmbeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    where?: EmailEmbeddingWhereInput
    orderBy?: EmailEmbeddingOrderByWithRelationInput | EmailEmbeddingOrderByWithRelationInput[]
    cursor?: EmailEmbeddingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmailEmbeddingScalarFieldEnum | EmailEmbeddingScalarFieldEnum[]
  }

  /**
   * User.priorityScores
   */
  export type User$priorityScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    where?: PriorityScoreWhereInput
    orderBy?: PriorityScoreOrderByWithRelationInput | PriorityScoreOrderByWithRelationInput[]
    cursor?: PriorityScoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PriorityScoreScalarFieldEnum | PriorityScoreScalarFieldEnum[]
  }

  /**
   * User.pendingActions
   */
  export type User$pendingActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    where?: PendingActionWhereInput
    orderBy?: PendingActionOrderByWithRelationInput | PendingActionOrderByWithRelationInput[]
    cursor?: PendingActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PendingActionScalarFieldEnum | PendingActionScalarFieldEnum[]
  }

  /**
   * User.preference
   */
  export type User$preferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    where?: UserPreferenceWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ChannelLink
   */

  export type AggregateChannelLink = {
    _count: ChannelLinkCountAggregateOutputType | null
    _min: ChannelLinkMinAggregateOutputType | null
    _max: ChannelLinkMaxAggregateOutputType | null
  }

  export type ChannelLinkMinAggregateOutputType = {
    id: string | null
    userId: string | null
    channel: string | null
    externalChatId: string | null
    linkedAt: Date | null
  }

  export type ChannelLinkMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    channel: string | null
    externalChatId: string | null
    linkedAt: Date | null
  }

  export type ChannelLinkCountAggregateOutputType = {
    id: number
    userId: number
    channel: number
    externalChatId: number
    linkedAt: number
    _all: number
  }


  export type ChannelLinkMinAggregateInputType = {
    id?: true
    userId?: true
    channel?: true
    externalChatId?: true
    linkedAt?: true
  }

  export type ChannelLinkMaxAggregateInputType = {
    id?: true
    userId?: true
    channel?: true
    externalChatId?: true
    linkedAt?: true
  }

  export type ChannelLinkCountAggregateInputType = {
    id?: true
    userId?: true
    channel?: true
    externalChatId?: true
    linkedAt?: true
    _all?: true
  }

  export type ChannelLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChannelLink to aggregate.
     */
    where?: ChannelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChannelLinks to fetch.
     */
    orderBy?: ChannelLinkOrderByWithRelationInput | ChannelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChannelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChannelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChannelLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChannelLinks
    **/
    _count?: true | ChannelLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChannelLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChannelLinkMaxAggregateInputType
  }

  export type GetChannelLinkAggregateType<T extends ChannelLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateChannelLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChannelLink[P]>
      : GetScalarType<T[P], AggregateChannelLink[P]>
  }




  export type ChannelLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChannelLinkWhereInput
    orderBy?: ChannelLinkOrderByWithAggregationInput | ChannelLinkOrderByWithAggregationInput[]
    by: ChannelLinkScalarFieldEnum[] | ChannelLinkScalarFieldEnum
    having?: ChannelLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChannelLinkCountAggregateInputType | true
    _min?: ChannelLinkMinAggregateInputType
    _max?: ChannelLinkMaxAggregateInputType
  }

  export type ChannelLinkGroupByOutputType = {
    id: string
    userId: string
    channel: string
    externalChatId: string
    linkedAt: Date
    _count: ChannelLinkCountAggregateOutputType | null
    _min: ChannelLinkMinAggregateOutputType | null
    _max: ChannelLinkMaxAggregateOutputType | null
  }

  type GetChannelLinkGroupByPayload<T extends ChannelLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChannelLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChannelLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChannelLinkGroupByOutputType[P]>
            : GetScalarType<T[P], ChannelLinkGroupByOutputType[P]>
        }
      >
    >


  export type ChannelLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channel?: boolean
    externalChatId?: boolean
    linkedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["channelLink"]>

  export type ChannelLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channel?: boolean
    externalChatId?: boolean
    linkedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["channelLink"]>

  export type ChannelLinkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channel?: boolean
    externalChatId?: boolean
    linkedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["channelLink"]>

  export type ChannelLinkSelectScalar = {
    id?: boolean
    userId?: boolean
    channel?: boolean
    externalChatId?: boolean
    linkedAt?: boolean
  }

  export type ChannelLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "channel" | "externalChatId" | "linkedAt", ExtArgs["result"]["channelLink"]>
  export type ChannelLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChannelLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChannelLinkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChannelLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChannelLink"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      channel: string
      externalChatId: string
      linkedAt: Date
    }, ExtArgs["result"]["channelLink"]>
    composites: {}
  }

  type ChannelLinkGetPayload<S extends boolean | null | undefined | ChannelLinkDefaultArgs> = $Result.GetResult<Prisma.$ChannelLinkPayload, S>

  type ChannelLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChannelLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChannelLinkCountAggregateInputType | true
    }

  export interface ChannelLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChannelLink'], meta: { name: 'ChannelLink' } }
    /**
     * Find zero or one ChannelLink that matches the filter.
     * @param {ChannelLinkFindUniqueArgs} args - Arguments to find a ChannelLink
     * @example
     * // Get one ChannelLink
     * const channelLink = await prisma.channelLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChannelLinkFindUniqueArgs>(args: SelectSubset<T, ChannelLinkFindUniqueArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChannelLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChannelLinkFindUniqueOrThrowArgs} args - Arguments to find a ChannelLink
     * @example
     * // Get one ChannelLink
     * const channelLink = await prisma.channelLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChannelLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, ChannelLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChannelLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkFindFirstArgs} args - Arguments to find a ChannelLink
     * @example
     * // Get one ChannelLink
     * const channelLink = await prisma.channelLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChannelLinkFindFirstArgs>(args?: SelectSubset<T, ChannelLinkFindFirstArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChannelLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkFindFirstOrThrowArgs} args - Arguments to find a ChannelLink
     * @example
     * // Get one ChannelLink
     * const channelLink = await prisma.channelLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChannelLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, ChannelLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChannelLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChannelLinks
     * const channelLinks = await prisma.channelLink.findMany()
     * 
     * // Get first 10 ChannelLinks
     * const channelLinks = await prisma.channelLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const channelLinkWithIdOnly = await prisma.channelLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChannelLinkFindManyArgs>(args?: SelectSubset<T, ChannelLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChannelLink.
     * @param {ChannelLinkCreateArgs} args - Arguments to create a ChannelLink.
     * @example
     * // Create one ChannelLink
     * const ChannelLink = await prisma.channelLink.create({
     *   data: {
     *     // ... data to create a ChannelLink
     *   }
     * })
     * 
     */
    create<T extends ChannelLinkCreateArgs>(args: SelectSubset<T, ChannelLinkCreateArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChannelLinks.
     * @param {ChannelLinkCreateManyArgs} args - Arguments to create many ChannelLinks.
     * @example
     * // Create many ChannelLinks
     * const channelLink = await prisma.channelLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChannelLinkCreateManyArgs>(args?: SelectSubset<T, ChannelLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChannelLinks and returns the data saved in the database.
     * @param {ChannelLinkCreateManyAndReturnArgs} args - Arguments to create many ChannelLinks.
     * @example
     * // Create many ChannelLinks
     * const channelLink = await prisma.channelLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChannelLinks and only return the `id`
     * const channelLinkWithIdOnly = await prisma.channelLink.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChannelLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, ChannelLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChannelLink.
     * @param {ChannelLinkDeleteArgs} args - Arguments to delete one ChannelLink.
     * @example
     * // Delete one ChannelLink
     * const ChannelLink = await prisma.channelLink.delete({
     *   where: {
     *     // ... filter to delete one ChannelLink
     *   }
     * })
     * 
     */
    delete<T extends ChannelLinkDeleteArgs>(args: SelectSubset<T, ChannelLinkDeleteArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChannelLink.
     * @param {ChannelLinkUpdateArgs} args - Arguments to update one ChannelLink.
     * @example
     * // Update one ChannelLink
     * const channelLink = await prisma.channelLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChannelLinkUpdateArgs>(args: SelectSubset<T, ChannelLinkUpdateArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChannelLinks.
     * @param {ChannelLinkDeleteManyArgs} args - Arguments to filter ChannelLinks to delete.
     * @example
     * // Delete a few ChannelLinks
     * const { count } = await prisma.channelLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChannelLinkDeleteManyArgs>(args?: SelectSubset<T, ChannelLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChannelLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChannelLinks
     * const channelLink = await prisma.channelLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChannelLinkUpdateManyArgs>(args: SelectSubset<T, ChannelLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChannelLinks and returns the data updated in the database.
     * @param {ChannelLinkUpdateManyAndReturnArgs} args - Arguments to update many ChannelLinks.
     * @example
     * // Update many ChannelLinks
     * const channelLink = await prisma.channelLink.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChannelLinks and only return the `id`
     * const channelLinkWithIdOnly = await prisma.channelLink.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChannelLinkUpdateManyAndReturnArgs>(args: SelectSubset<T, ChannelLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChannelLink.
     * @param {ChannelLinkUpsertArgs} args - Arguments to update or create a ChannelLink.
     * @example
     * // Update or create a ChannelLink
     * const channelLink = await prisma.channelLink.upsert({
     *   create: {
     *     // ... data to create a ChannelLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChannelLink we want to update
     *   }
     * })
     */
    upsert<T extends ChannelLinkUpsertArgs>(args: SelectSubset<T, ChannelLinkUpsertArgs<ExtArgs>>): Prisma__ChannelLinkClient<$Result.GetResult<Prisma.$ChannelLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChannelLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkCountArgs} args - Arguments to filter ChannelLinks to count.
     * @example
     * // Count the number of ChannelLinks
     * const count = await prisma.channelLink.count({
     *   where: {
     *     // ... the filter for the ChannelLinks we want to count
     *   }
     * })
    **/
    count<T extends ChannelLinkCountArgs>(
      args?: Subset<T, ChannelLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChannelLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChannelLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChannelLinkAggregateArgs>(args: Subset<T, ChannelLinkAggregateArgs>): Prisma.PrismaPromise<GetChannelLinkAggregateType<T>>

    /**
     * Group by ChannelLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelLinkGroupByArgs} args - Group by arguments.
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
      T extends ChannelLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChannelLinkGroupByArgs['orderBy'] }
        : { orderBy?: ChannelLinkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChannelLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChannelLink model
   */
  readonly fields: ChannelLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChannelLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChannelLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ChannelLink model
   */
  interface ChannelLinkFieldRefs {
    readonly id: FieldRef<"ChannelLink", 'String'>
    readonly userId: FieldRef<"ChannelLink", 'String'>
    readonly channel: FieldRef<"ChannelLink", 'String'>
    readonly externalChatId: FieldRef<"ChannelLink", 'String'>
    readonly linkedAt: FieldRef<"ChannelLink", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChannelLink findUnique
   */
  export type ChannelLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * Filter, which ChannelLink to fetch.
     */
    where: ChannelLinkWhereUniqueInput
  }

  /**
   * ChannelLink findUniqueOrThrow
   */
  export type ChannelLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * Filter, which ChannelLink to fetch.
     */
    where: ChannelLinkWhereUniqueInput
  }

  /**
   * ChannelLink findFirst
   */
  export type ChannelLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * Filter, which ChannelLink to fetch.
     */
    where?: ChannelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChannelLinks to fetch.
     */
    orderBy?: ChannelLinkOrderByWithRelationInput | ChannelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChannelLinks.
     */
    cursor?: ChannelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChannelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChannelLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChannelLinks.
     */
    distinct?: ChannelLinkScalarFieldEnum | ChannelLinkScalarFieldEnum[]
  }

  /**
   * ChannelLink findFirstOrThrow
   */
  export type ChannelLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * Filter, which ChannelLink to fetch.
     */
    where?: ChannelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChannelLinks to fetch.
     */
    orderBy?: ChannelLinkOrderByWithRelationInput | ChannelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChannelLinks.
     */
    cursor?: ChannelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChannelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChannelLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChannelLinks.
     */
    distinct?: ChannelLinkScalarFieldEnum | ChannelLinkScalarFieldEnum[]
  }

  /**
   * ChannelLink findMany
   */
  export type ChannelLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * Filter, which ChannelLinks to fetch.
     */
    where?: ChannelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChannelLinks to fetch.
     */
    orderBy?: ChannelLinkOrderByWithRelationInput | ChannelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChannelLinks.
     */
    cursor?: ChannelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChannelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChannelLinks.
     */
    skip?: number
    distinct?: ChannelLinkScalarFieldEnum | ChannelLinkScalarFieldEnum[]
  }

  /**
   * ChannelLink create
   */
  export type ChannelLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a ChannelLink.
     */
    data: XOR<ChannelLinkCreateInput, ChannelLinkUncheckedCreateInput>
  }

  /**
   * ChannelLink createMany
   */
  export type ChannelLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChannelLinks.
     */
    data: ChannelLinkCreateManyInput | ChannelLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChannelLink createManyAndReturn
   */
  export type ChannelLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * The data used to create many ChannelLinks.
     */
    data: ChannelLinkCreateManyInput | ChannelLinkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChannelLink update
   */
  export type ChannelLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a ChannelLink.
     */
    data: XOR<ChannelLinkUpdateInput, ChannelLinkUncheckedUpdateInput>
    /**
     * Choose, which ChannelLink to update.
     */
    where: ChannelLinkWhereUniqueInput
  }

  /**
   * ChannelLink updateMany
   */
  export type ChannelLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChannelLinks.
     */
    data: XOR<ChannelLinkUpdateManyMutationInput, ChannelLinkUncheckedUpdateManyInput>
    /**
     * Filter which ChannelLinks to update
     */
    where?: ChannelLinkWhereInput
    /**
     * Limit how many ChannelLinks to update.
     */
    limit?: number
  }

  /**
   * ChannelLink updateManyAndReturn
   */
  export type ChannelLinkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * The data used to update ChannelLinks.
     */
    data: XOR<ChannelLinkUpdateManyMutationInput, ChannelLinkUncheckedUpdateManyInput>
    /**
     * Filter which ChannelLinks to update
     */
    where?: ChannelLinkWhereInput
    /**
     * Limit how many ChannelLinks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChannelLink upsert
   */
  export type ChannelLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the ChannelLink to update in case it exists.
     */
    where: ChannelLinkWhereUniqueInput
    /**
     * In case the ChannelLink found by the `where` argument doesn't exist, create a new ChannelLink with this data.
     */
    create: XOR<ChannelLinkCreateInput, ChannelLinkUncheckedCreateInput>
    /**
     * In case the ChannelLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChannelLinkUpdateInput, ChannelLinkUncheckedUpdateInput>
  }

  /**
   * ChannelLink delete
   */
  export type ChannelLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
    /**
     * Filter which ChannelLink to delete.
     */
    where: ChannelLinkWhereUniqueInput
  }

  /**
   * ChannelLink deleteMany
   */
  export type ChannelLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChannelLinks to delete
     */
    where?: ChannelLinkWhereInput
    /**
     * Limit how many ChannelLinks to delete.
     */
    limit?: number
  }

  /**
   * ChannelLink without action
   */
  export type ChannelLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelLink
     */
    select?: ChannelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChannelLink
     */
    omit?: ChannelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChannelLinkInclude<ExtArgs> | null
  }


  /**
   * Model EmailEmbedding
   */

  export type AggregateEmailEmbedding = {
    _count: EmailEmbeddingCountAggregateOutputType | null
    _min: EmailEmbeddingMinAggregateOutputType | null
    _max: EmailEmbeddingMaxAggregateOutputType | null
  }

  export type EmailEmbeddingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    corsairEntityId: string | null
    threadId: string | null
    subjectSnippet: string | null
    indexedAt: Date | null
  }

  export type EmailEmbeddingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    corsairEntityId: string | null
    threadId: string | null
    subjectSnippet: string | null
    indexedAt: Date | null
  }

  export type EmailEmbeddingCountAggregateOutputType = {
    id: number
    userId: number
    corsairEntityId: number
    threadId: number
    subjectSnippet: number
    indexedAt: number
    _all: number
  }


  export type EmailEmbeddingMinAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    threadId?: true
    subjectSnippet?: true
    indexedAt?: true
  }

  export type EmailEmbeddingMaxAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    threadId?: true
    subjectSnippet?: true
    indexedAt?: true
  }

  export type EmailEmbeddingCountAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    threadId?: true
    subjectSnippet?: true
    indexedAt?: true
    _all?: true
  }

  export type EmailEmbeddingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailEmbedding to aggregate.
     */
    where?: EmailEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailEmbeddings to fetch.
     */
    orderBy?: EmailEmbeddingOrderByWithRelationInput | EmailEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailEmbeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailEmbeddings
    **/
    _count?: true | EmailEmbeddingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailEmbeddingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailEmbeddingMaxAggregateInputType
  }

  export type GetEmailEmbeddingAggregateType<T extends EmailEmbeddingAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailEmbedding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailEmbedding[P]>
      : GetScalarType<T[P], AggregateEmailEmbedding[P]>
  }




  export type EmailEmbeddingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailEmbeddingWhereInput
    orderBy?: EmailEmbeddingOrderByWithAggregationInput | EmailEmbeddingOrderByWithAggregationInput[]
    by: EmailEmbeddingScalarFieldEnum[] | EmailEmbeddingScalarFieldEnum
    having?: EmailEmbeddingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailEmbeddingCountAggregateInputType | true
    _min?: EmailEmbeddingMinAggregateInputType
    _max?: EmailEmbeddingMaxAggregateInputType
  }

  export type EmailEmbeddingGroupByOutputType = {
    id: string
    userId: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt: Date
    _count: EmailEmbeddingCountAggregateOutputType | null
    _min: EmailEmbeddingMinAggregateOutputType | null
    _max: EmailEmbeddingMaxAggregateOutputType | null
  }

  type GetEmailEmbeddingGroupByPayload<T extends EmailEmbeddingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailEmbeddingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailEmbeddingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailEmbeddingGroupByOutputType[P]>
            : GetScalarType<T[P], EmailEmbeddingGroupByOutputType[P]>
        }
      >
    >


  export type EmailEmbeddingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    subjectSnippet?: boolean
    indexedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailEmbedding"]>

  export type EmailEmbeddingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    subjectSnippet?: boolean
    indexedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailEmbedding"]>

  export type EmailEmbeddingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    subjectSnippet?: boolean
    indexedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailEmbedding"]>

  export type EmailEmbeddingSelectScalar = {
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    subjectSnippet?: boolean
    indexedAt?: boolean
  }

  export type EmailEmbeddingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "corsairEntityId" | "threadId" | "subjectSnippet" | "indexedAt", ExtArgs["result"]["emailEmbedding"]>
  export type EmailEmbeddingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EmailEmbeddingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EmailEmbeddingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EmailEmbeddingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailEmbedding"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      corsairEntityId: string
      threadId: string
      subjectSnippet: string
      indexedAt: Date
    }, ExtArgs["result"]["emailEmbedding"]>
    composites: {}
  }

  type EmailEmbeddingGetPayload<S extends boolean | null | undefined | EmailEmbeddingDefaultArgs> = $Result.GetResult<Prisma.$EmailEmbeddingPayload, S>

  type EmailEmbeddingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmailEmbeddingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmailEmbeddingCountAggregateInputType | true
    }

  export interface EmailEmbeddingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailEmbedding'], meta: { name: 'EmailEmbedding' } }
    /**
     * Find zero or one EmailEmbedding that matches the filter.
     * @param {EmailEmbeddingFindUniqueArgs} args - Arguments to find a EmailEmbedding
     * @example
     * // Get one EmailEmbedding
     * const emailEmbedding = await prisma.emailEmbedding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailEmbeddingFindUniqueArgs>(args: SelectSubset<T, EmailEmbeddingFindUniqueArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmailEmbedding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailEmbeddingFindUniqueOrThrowArgs} args - Arguments to find a EmailEmbedding
     * @example
     * // Get one EmailEmbedding
     * const emailEmbedding = await prisma.emailEmbedding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailEmbeddingFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailEmbeddingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailEmbedding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingFindFirstArgs} args - Arguments to find a EmailEmbedding
     * @example
     * // Get one EmailEmbedding
     * const emailEmbedding = await prisma.emailEmbedding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailEmbeddingFindFirstArgs>(args?: SelectSubset<T, EmailEmbeddingFindFirstArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailEmbedding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingFindFirstOrThrowArgs} args - Arguments to find a EmailEmbedding
     * @example
     * // Get one EmailEmbedding
     * const emailEmbedding = await prisma.emailEmbedding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailEmbeddingFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailEmbeddingFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmailEmbeddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailEmbeddings
     * const emailEmbeddings = await prisma.emailEmbedding.findMany()
     * 
     * // Get first 10 EmailEmbeddings
     * const emailEmbeddings = await prisma.emailEmbedding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailEmbeddingWithIdOnly = await prisma.emailEmbedding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailEmbeddingFindManyArgs>(args?: SelectSubset<T, EmailEmbeddingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmailEmbedding.
     * @param {EmailEmbeddingCreateArgs} args - Arguments to create a EmailEmbedding.
     * @example
     * // Create one EmailEmbedding
     * const EmailEmbedding = await prisma.emailEmbedding.create({
     *   data: {
     *     // ... data to create a EmailEmbedding
     *   }
     * })
     * 
     */
    create<T extends EmailEmbeddingCreateArgs>(args: SelectSubset<T, EmailEmbeddingCreateArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmailEmbeddings.
     * @param {EmailEmbeddingCreateManyArgs} args - Arguments to create many EmailEmbeddings.
     * @example
     * // Create many EmailEmbeddings
     * const emailEmbedding = await prisma.emailEmbedding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailEmbeddingCreateManyArgs>(args?: SelectSubset<T, EmailEmbeddingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailEmbeddings and returns the data saved in the database.
     * @param {EmailEmbeddingCreateManyAndReturnArgs} args - Arguments to create many EmailEmbeddings.
     * @example
     * // Create many EmailEmbeddings
     * const emailEmbedding = await prisma.emailEmbedding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailEmbeddings and only return the `id`
     * const emailEmbeddingWithIdOnly = await prisma.emailEmbedding.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailEmbeddingCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailEmbeddingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EmailEmbedding.
     * @param {EmailEmbeddingDeleteArgs} args - Arguments to delete one EmailEmbedding.
     * @example
     * // Delete one EmailEmbedding
     * const EmailEmbedding = await prisma.emailEmbedding.delete({
     *   where: {
     *     // ... filter to delete one EmailEmbedding
     *   }
     * })
     * 
     */
    delete<T extends EmailEmbeddingDeleteArgs>(args: SelectSubset<T, EmailEmbeddingDeleteArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmailEmbedding.
     * @param {EmailEmbeddingUpdateArgs} args - Arguments to update one EmailEmbedding.
     * @example
     * // Update one EmailEmbedding
     * const emailEmbedding = await prisma.emailEmbedding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailEmbeddingUpdateArgs>(args: SelectSubset<T, EmailEmbeddingUpdateArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmailEmbeddings.
     * @param {EmailEmbeddingDeleteManyArgs} args - Arguments to filter EmailEmbeddings to delete.
     * @example
     * // Delete a few EmailEmbeddings
     * const { count } = await prisma.emailEmbedding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailEmbeddingDeleteManyArgs>(args?: SelectSubset<T, EmailEmbeddingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailEmbeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailEmbeddings
     * const emailEmbedding = await prisma.emailEmbedding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailEmbeddingUpdateManyArgs>(args: SelectSubset<T, EmailEmbeddingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailEmbeddings and returns the data updated in the database.
     * @param {EmailEmbeddingUpdateManyAndReturnArgs} args - Arguments to update many EmailEmbeddings.
     * @example
     * // Update many EmailEmbeddings
     * const emailEmbedding = await prisma.emailEmbedding.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EmailEmbeddings and only return the `id`
     * const emailEmbeddingWithIdOnly = await prisma.emailEmbedding.updateManyAndReturn({
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
    updateManyAndReturn<T extends EmailEmbeddingUpdateManyAndReturnArgs>(args: SelectSubset<T, EmailEmbeddingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EmailEmbedding.
     * @param {EmailEmbeddingUpsertArgs} args - Arguments to update or create a EmailEmbedding.
     * @example
     * // Update or create a EmailEmbedding
     * const emailEmbedding = await prisma.emailEmbedding.upsert({
     *   create: {
     *     // ... data to create a EmailEmbedding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailEmbedding we want to update
     *   }
     * })
     */
    upsert<T extends EmailEmbeddingUpsertArgs>(args: SelectSubset<T, EmailEmbeddingUpsertArgs<ExtArgs>>): Prisma__EmailEmbeddingClient<$Result.GetResult<Prisma.$EmailEmbeddingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmailEmbeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingCountArgs} args - Arguments to filter EmailEmbeddings to count.
     * @example
     * // Count the number of EmailEmbeddings
     * const count = await prisma.emailEmbedding.count({
     *   where: {
     *     // ... the filter for the EmailEmbeddings we want to count
     *   }
     * })
    **/
    count<T extends EmailEmbeddingCountArgs>(
      args?: Subset<T, EmailEmbeddingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailEmbeddingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailEmbedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EmailEmbeddingAggregateArgs>(args: Subset<T, EmailEmbeddingAggregateArgs>): Prisma.PrismaPromise<GetEmailEmbeddingAggregateType<T>>

    /**
     * Group by EmailEmbedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailEmbeddingGroupByArgs} args - Group by arguments.
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
      T extends EmailEmbeddingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailEmbeddingGroupByArgs['orderBy'] }
        : { orderBy?: EmailEmbeddingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EmailEmbeddingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailEmbeddingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailEmbedding model
   */
  readonly fields: EmailEmbeddingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailEmbedding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailEmbeddingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the EmailEmbedding model
   */
  interface EmailEmbeddingFieldRefs {
    readonly id: FieldRef<"EmailEmbedding", 'String'>
    readonly userId: FieldRef<"EmailEmbedding", 'String'>
    readonly corsairEntityId: FieldRef<"EmailEmbedding", 'String'>
    readonly threadId: FieldRef<"EmailEmbedding", 'String'>
    readonly subjectSnippet: FieldRef<"EmailEmbedding", 'String'>
    readonly indexedAt: FieldRef<"EmailEmbedding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailEmbedding findUnique
   */
  export type EmailEmbeddingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which EmailEmbedding to fetch.
     */
    where: EmailEmbeddingWhereUniqueInput
  }

  /**
   * EmailEmbedding findUniqueOrThrow
   */
  export type EmailEmbeddingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which EmailEmbedding to fetch.
     */
    where: EmailEmbeddingWhereUniqueInput
  }

  /**
   * EmailEmbedding findFirst
   */
  export type EmailEmbeddingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which EmailEmbedding to fetch.
     */
    where?: EmailEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailEmbeddings to fetch.
     */
    orderBy?: EmailEmbeddingOrderByWithRelationInput | EmailEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailEmbeddings.
     */
    cursor?: EmailEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailEmbeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailEmbeddings.
     */
    distinct?: EmailEmbeddingScalarFieldEnum | EmailEmbeddingScalarFieldEnum[]
  }

  /**
   * EmailEmbedding findFirstOrThrow
   */
  export type EmailEmbeddingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which EmailEmbedding to fetch.
     */
    where?: EmailEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailEmbeddings to fetch.
     */
    orderBy?: EmailEmbeddingOrderByWithRelationInput | EmailEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailEmbeddings.
     */
    cursor?: EmailEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailEmbeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailEmbeddings.
     */
    distinct?: EmailEmbeddingScalarFieldEnum | EmailEmbeddingScalarFieldEnum[]
  }

  /**
   * EmailEmbedding findMany
   */
  export type EmailEmbeddingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which EmailEmbeddings to fetch.
     */
    where?: EmailEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailEmbeddings to fetch.
     */
    orderBy?: EmailEmbeddingOrderByWithRelationInput | EmailEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailEmbeddings.
     */
    cursor?: EmailEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailEmbeddings.
     */
    skip?: number
    distinct?: EmailEmbeddingScalarFieldEnum | EmailEmbeddingScalarFieldEnum[]
  }

  /**
   * EmailEmbedding create
   */
  export type EmailEmbeddingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * The data needed to create a EmailEmbedding.
     */
    data: XOR<EmailEmbeddingCreateInput, EmailEmbeddingUncheckedCreateInput>
  }

  /**
   * EmailEmbedding createMany
   */
  export type EmailEmbeddingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailEmbeddings.
     */
    data: EmailEmbeddingCreateManyInput | EmailEmbeddingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailEmbedding createManyAndReturn
   */
  export type EmailEmbeddingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * The data used to create many EmailEmbeddings.
     */
    data: EmailEmbeddingCreateManyInput | EmailEmbeddingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmailEmbedding update
   */
  export type EmailEmbeddingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * The data needed to update a EmailEmbedding.
     */
    data: XOR<EmailEmbeddingUpdateInput, EmailEmbeddingUncheckedUpdateInput>
    /**
     * Choose, which EmailEmbedding to update.
     */
    where: EmailEmbeddingWhereUniqueInput
  }

  /**
   * EmailEmbedding updateMany
   */
  export type EmailEmbeddingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailEmbeddings.
     */
    data: XOR<EmailEmbeddingUpdateManyMutationInput, EmailEmbeddingUncheckedUpdateManyInput>
    /**
     * Filter which EmailEmbeddings to update
     */
    where?: EmailEmbeddingWhereInput
    /**
     * Limit how many EmailEmbeddings to update.
     */
    limit?: number
  }

  /**
   * EmailEmbedding updateManyAndReturn
   */
  export type EmailEmbeddingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * The data used to update EmailEmbeddings.
     */
    data: XOR<EmailEmbeddingUpdateManyMutationInput, EmailEmbeddingUncheckedUpdateManyInput>
    /**
     * Filter which EmailEmbeddings to update
     */
    where?: EmailEmbeddingWhereInput
    /**
     * Limit how many EmailEmbeddings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmailEmbedding upsert
   */
  export type EmailEmbeddingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * The filter to search for the EmailEmbedding to update in case it exists.
     */
    where: EmailEmbeddingWhereUniqueInput
    /**
     * In case the EmailEmbedding found by the `where` argument doesn't exist, create a new EmailEmbedding with this data.
     */
    create: XOR<EmailEmbeddingCreateInput, EmailEmbeddingUncheckedCreateInput>
    /**
     * In case the EmailEmbedding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailEmbeddingUpdateInput, EmailEmbeddingUncheckedUpdateInput>
  }

  /**
   * EmailEmbedding delete
   */
  export type EmailEmbeddingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
    /**
     * Filter which EmailEmbedding to delete.
     */
    where: EmailEmbeddingWhereUniqueInput
  }

  /**
   * EmailEmbedding deleteMany
   */
  export type EmailEmbeddingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailEmbeddings to delete
     */
    where?: EmailEmbeddingWhereInput
    /**
     * Limit how many EmailEmbeddings to delete.
     */
    limit?: number
  }

  /**
   * EmailEmbedding without action
   */
  export type EmailEmbeddingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailEmbedding
     */
    select?: EmailEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailEmbedding
     */
    omit?: EmailEmbeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailEmbeddingInclude<ExtArgs> | null
  }


  /**
   * Model PriorityScore
   */

  export type AggregatePriorityScore = {
    _count: PriorityScoreCountAggregateOutputType | null
    _min: PriorityScoreMinAggregateOutputType | null
    _max: PriorityScoreMaxAggregateOutputType | null
  }

  export type PriorityScoreMinAggregateOutputType = {
    id: string | null
    userId: string | null
    corsairEntityId: string | null
    threadId: string | null
    label: string | null
    reason: string | null
    model: string | null
    createdAt: Date | null
  }

  export type PriorityScoreMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    corsairEntityId: string | null
    threadId: string | null
    label: string | null
    reason: string | null
    model: string | null
    createdAt: Date | null
  }

  export type PriorityScoreCountAggregateOutputType = {
    id: number
    userId: number
    corsairEntityId: number
    threadId: number
    label: number
    reason: number
    model: number
    createdAt: number
    _all: number
  }


  export type PriorityScoreMinAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    threadId?: true
    label?: true
    reason?: true
    model?: true
    createdAt?: true
  }

  export type PriorityScoreMaxAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    threadId?: true
    label?: true
    reason?: true
    model?: true
    createdAt?: true
  }

  export type PriorityScoreCountAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    threadId?: true
    label?: true
    reason?: true
    model?: true
    createdAt?: true
    _all?: true
  }

  export type PriorityScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriorityScore to aggregate.
     */
    where?: PriorityScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityScores to fetch.
     */
    orderBy?: PriorityScoreOrderByWithRelationInput | PriorityScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriorityScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriorityScores
    **/
    _count?: true | PriorityScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriorityScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriorityScoreMaxAggregateInputType
  }

  export type GetPriorityScoreAggregateType<T extends PriorityScoreAggregateArgs> = {
        [P in keyof T & keyof AggregatePriorityScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriorityScore[P]>
      : GetScalarType<T[P], AggregatePriorityScore[P]>
  }




  export type PriorityScoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriorityScoreWhereInput
    orderBy?: PriorityScoreOrderByWithAggregationInput | PriorityScoreOrderByWithAggregationInput[]
    by: PriorityScoreScalarFieldEnum[] | PriorityScoreScalarFieldEnum
    having?: PriorityScoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriorityScoreCountAggregateInputType | true
    _min?: PriorityScoreMinAggregateInputType
    _max?: PriorityScoreMaxAggregateInputType
  }

  export type PriorityScoreGroupByOutputType = {
    id: string
    userId: string
    corsairEntityId: string
    threadId: string
    label: string
    reason: string | null
    model: string | null
    createdAt: Date
    _count: PriorityScoreCountAggregateOutputType | null
    _min: PriorityScoreMinAggregateOutputType | null
    _max: PriorityScoreMaxAggregateOutputType | null
  }

  type GetPriorityScoreGroupByPayload<T extends PriorityScoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriorityScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriorityScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriorityScoreGroupByOutputType[P]>
            : GetScalarType<T[P], PriorityScoreGroupByOutputType[P]>
        }
      >
    >


  export type PriorityScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    label?: boolean
    reason?: boolean
    model?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priorityScore"]>

  export type PriorityScoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    label?: boolean
    reason?: boolean
    model?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priorityScore"]>

  export type PriorityScoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    label?: boolean
    reason?: boolean
    model?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priorityScore"]>

  export type PriorityScoreSelectScalar = {
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    threadId?: boolean
    label?: boolean
    reason?: boolean
    model?: boolean
    createdAt?: boolean
  }

  export type PriorityScoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "corsairEntityId" | "threadId" | "label" | "reason" | "model" | "createdAt", ExtArgs["result"]["priorityScore"]>
  export type PriorityScoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PriorityScoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PriorityScoreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PriorityScorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriorityScore"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      corsairEntityId: string
      threadId: string
      label: string
      reason: string | null
      model: string | null
      createdAt: Date
    }, ExtArgs["result"]["priorityScore"]>
    composites: {}
  }

  type PriorityScoreGetPayload<S extends boolean | null | undefined | PriorityScoreDefaultArgs> = $Result.GetResult<Prisma.$PriorityScorePayload, S>

  type PriorityScoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriorityScoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriorityScoreCountAggregateInputType | true
    }

  export interface PriorityScoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriorityScore'], meta: { name: 'PriorityScore' } }
    /**
     * Find zero or one PriorityScore that matches the filter.
     * @param {PriorityScoreFindUniqueArgs} args - Arguments to find a PriorityScore
     * @example
     * // Get one PriorityScore
     * const priorityScore = await prisma.priorityScore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriorityScoreFindUniqueArgs>(args: SelectSubset<T, PriorityScoreFindUniqueArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PriorityScore that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriorityScoreFindUniqueOrThrowArgs} args - Arguments to find a PriorityScore
     * @example
     * // Get one PriorityScore
     * const priorityScore = await prisma.priorityScore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriorityScoreFindUniqueOrThrowArgs>(args: SelectSubset<T, PriorityScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriorityScore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreFindFirstArgs} args - Arguments to find a PriorityScore
     * @example
     * // Get one PriorityScore
     * const priorityScore = await prisma.priorityScore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriorityScoreFindFirstArgs>(args?: SelectSubset<T, PriorityScoreFindFirstArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriorityScore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreFindFirstOrThrowArgs} args - Arguments to find a PriorityScore
     * @example
     * // Get one PriorityScore
     * const priorityScore = await prisma.priorityScore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriorityScoreFindFirstOrThrowArgs>(args?: SelectSubset<T, PriorityScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PriorityScores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriorityScores
     * const priorityScores = await prisma.priorityScore.findMany()
     * 
     * // Get first 10 PriorityScores
     * const priorityScores = await prisma.priorityScore.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priorityScoreWithIdOnly = await prisma.priorityScore.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriorityScoreFindManyArgs>(args?: SelectSubset<T, PriorityScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PriorityScore.
     * @param {PriorityScoreCreateArgs} args - Arguments to create a PriorityScore.
     * @example
     * // Create one PriorityScore
     * const PriorityScore = await prisma.priorityScore.create({
     *   data: {
     *     // ... data to create a PriorityScore
     *   }
     * })
     * 
     */
    create<T extends PriorityScoreCreateArgs>(args: SelectSubset<T, PriorityScoreCreateArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PriorityScores.
     * @param {PriorityScoreCreateManyArgs} args - Arguments to create many PriorityScores.
     * @example
     * // Create many PriorityScores
     * const priorityScore = await prisma.priorityScore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriorityScoreCreateManyArgs>(args?: SelectSubset<T, PriorityScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriorityScores and returns the data saved in the database.
     * @param {PriorityScoreCreateManyAndReturnArgs} args - Arguments to create many PriorityScores.
     * @example
     * // Create many PriorityScores
     * const priorityScore = await prisma.priorityScore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriorityScores and only return the `id`
     * const priorityScoreWithIdOnly = await prisma.priorityScore.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriorityScoreCreateManyAndReturnArgs>(args?: SelectSubset<T, PriorityScoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PriorityScore.
     * @param {PriorityScoreDeleteArgs} args - Arguments to delete one PriorityScore.
     * @example
     * // Delete one PriorityScore
     * const PriorityScore = await prisma.priorityScore.delete({
     *   where: {
     *     // ... filter to delete one PriorityScore
     *   }
     * })
     * 
     */
    delete<T extends PriorityScoreDeleteArgs>(args: SelectSubset<T, PriorityScoreDeleteArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PriorityScore.
     * @param {PriorityScoreUpdateArgs} args - Arguments to update one PriorityScore.
     * @example
     * // Update one PriorityScore
     * const priorityScore = await prisma.priorityScore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriorityScoreUpdateArgs>(args: SelectSubset<T, PriorityScoreUpdateArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PriorityScores.
     * @param {PriorityScoreDeleteManyArgs} args - Arguments to filter PriorityScores to delete.
     * @example
     * // Delete a few PriorityScores
     * const { count } = await prisma.priorityScore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriorityScoreDeleteManyArgs>(args?: SelectSubset<T, PriorityScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriorityScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriorityScores
     * const priorityScore = await prisma.priorityScore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriorityScoreUpdateManyArgs>(args: SelectSubset<T, PriorityScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriorityScores and returns the data updated in the database.
     * @param {PriorityScoreUpdateManyAndReturnArgs} args - Arguments to update many PriorityScores.
     * @example
     * // Update many PriorityScores
     * const priorityScore = await prisma.priorityScore.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PriorityScores and only return the `id`
     * const priorityScoreWithIdOnly = await prisma.priorityScore.updateManyAndReturn({
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
    updateManyAndReturn<T extends PriorityScoreUpdateManyAndReturnArgs>(args: SelectSubset<T, PriorityScoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PriorityScore.
     * @param {PriorityScoreUpsertArgs} args - Arguments to update or create a PriorityScore.
     * @example
     * // Update or create a PriorityScore
     * const priorityScore = await prisma.priorityScore.upsert({
     *   create: {
     *     // ... data to create a PriorityScore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriorityScore we want to update
     *   }
     * })
     */
    upsert<T extends PriorityScoreUpsertArgs>(args: SelectSubset<T, PriorityScoreUpsertArgs<ExtArgs>>): Prisma__PriorityScoreClient<$Result.GetResult<Prisma.$PriorityScorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PriorityScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreCountArgs} args - Arguments to filter PriorityScores to count.
     * @example
     * // Count the number of PriorityScores
     * const count = await prisma.priorityScore.count({
     *   where: {
     *     // ... the filter for the PriorityScores we want to count
     *   }
     * })
    **/
    count<T extends PriorityScoreCountArgs>(
      args?: Subset<T, PriorityScoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriorityScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriorityScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PriorityScoreAggregateArgs>(args: Subset<T, PriorityScoreAggregateArgs>): Prisma.PrismaPromise<GetPriorityScoreAggregateType<T>>

    /**
     * Group by PriorityScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityScoreGroupByArgs} args - Group by arguments.
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
      T extends PriorityScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriorityScoreGroupByArgs['orderBy'] }
        : { orderBy?: PriorityScoreGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PriorityScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriorityScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriorityScore model
   */
  readonly fields: PriorityScoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriorityScore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriorityScoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PriorityScore model
   */
  interface PriorityScoreFieldRefs {
    readonly id: FieldRef<"PriorityScore", 'String'>
    readonly userId: FieldRef<"PriorityScore", 'String'>
    readonly corsairEntityId: FieldRef<"PriorityScore", 'String'>
    readonly threadId: FieldRef<"PriorityScore", 'String'>
    readonly label: FieldRef<"PriorityScore", 'String'>
    readonly reason: FieldRef<"PriorityScore", 'String'>
    readonly model: FieldRef<"PriorityScore", 'String'>
    readonly createdAt: FieldRef<"PriorityScore", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PriorityScore findUnique
   */
  export type PriorityScoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * Filter, which PriorityScore to fetch.
     */
    where: PriorityScoreWhereUniqueInput
  }

  /**
   * PriorityScore findUniqueOrThrow
   */
  export type PriorityScoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * Filter, which PriorityScore to fetch.
     */
    where: PriorityScoreWhereUniqueInput
  }

  /**
   * PriorityScore findFirst
   */
  export type PriorityScoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * Filter, which PriorityScore to fetch.
     */
    where?: PriorityScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityScores to fetch.
     */
    orderBy?: PriorityScoreOrderByWithRelationInput | PriorityScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriorityScores.
     */
    cursor?: PriorityScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorityScores.
     */
    distinct?: PriorityScoreScalarFieldEnum | PriorityScoreScalarFieldEnum[]
  }

  /**
   * PriorityScore findFirstOrThrow
   */
  export type PriorityScoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * Filter, which PriorityScore to fetch.
     */
    where?: PriorityScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityScores to fetch.
     */
    orderBy?: PriorityScoreOrderByWithRelationInput | PriorityScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriorityScores.
     */
    cursor?: PriorityScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorityScores.
     */
    distinct?: PriorityScoreScalarFieldEnum | PriorityScoreScalarFieldEnum[]
  }

  /**
   * PriorityScore findMany
   */
  export type PriorityScoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * Filter, which PriorityScores to fetch.
     */
    where?: PriorityScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityScores to fetch.
     */
    orderBy?: PriorityScoreOrderByWithRelationInput | PriorityScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriorityScores.
     */
    cursor?: PriorityScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityScores.
     */
    skip?: number
    distinct?: PriorityScoreScalarFieldEnum | PriorityScoreScalarFieldEnum[]
  }

  /**
   * PriorityScore create
   */
  export type PriorityScoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * The data needed to create a PriorityScore.
     */
    data: XOR<PriorityScoreCreateInput, PriorityScoreUncheckedCreateInput>
  }

  /**
   * PriorityScore createMany
   */
  export type PriorityScoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriorityScores.
     */
    data: PriorityScoreCreateManyInput | PriorityScoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriorityScore createManyAndReturn
   */
  export type PriorityScoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * The data used to create many PriorityScores.
     */
    data: PriorityScoreCreateManyInput | PriorityScoreCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriorityScore update
   */
  export type PriorityScoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * The data needed to update a PriorityScore.
     */
    data: XOR<PriorityScoreUpdateInput, PriorityScoreUncheckedUpdateInput>
    /**
     * Choose, which PriorityScore to update.
     */
    where: PriorityScoreWhereUniqueInput
  }

  /**
   * PriorityScore updateMany
   */
  export type PriorityScoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriorityScores.
     */
    data: XOR<PriorityScoreUpdateManyMutationInput, PriorityScoreUncheckedUpdateManyInput>
    /**
     * Filter which PriorityScores to update
     */
    where?: PriorityScoreWhereInput
    /**
     * Limit how many PriorityScores to update.
     */
    limit?: number
  }

  /**
   * PriorityScore updateManyAndReturn
   */
  export type PriorityScoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * The data used to update PriorityScores.
     */
    data: XOR<PriorityScoreUpdateManyMutationInput, PriorityScoreUncheckedUpdateManyInput>
    /**
     * Filter which PriorityScores to update
     */
    where?: PriorityScoreWhereInput
    /**
     * Limit how many PriorityScores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriorityScore upsert
   */
  export type PriorityScoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * The filter to search for the PriorityScore to update in case it exists.
     */
    where: PriorityScoreWhereUniqueInput
    /**
     * In case the PriorityScore found by the `where` argument doesn't exist, create a new PriorityScore with this data.
     */
    create: XOR<PriorityScoreCreateInput, PriorityScoreUncheckedCreateInput>
    /**
     * In case the PriorityScore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriorityScoreUpdateInput, PriorityScoreUncheckedUpdateInput>
  }

  /**
   * PriorityScore delete
   */
  export type PriorityScoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
    /**
     * Filter which PriorityScore to delete.
     */
    where: PriorityScoreWhereUniqueInput
  }

  /**
   * PriorityScore deleteMany
   */
  export type PriorityScoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriorityScores to delete
     */
    where?: PriorityScoreWhereInput
    /**
     * Limit how many PriorityScores to delete.
     */
    limit?: number
  }

  /**
   * PriorityScore without action
   */
  export type PriorityScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityScore
     */
    select?: PriorityScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityScore
     */
    omit?: PriorityScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorityScoreInclude<ExtArgs> | null
  }


  /**
   * Model PendingAction
   */

  export type AggregatePendingAction = {
    _count: PendingActionCountAggregateOutputType | null
    _min: PendingActionMinAggregateOutputType | null
    _max: PendingActionMaxAggregateOutputType | null
  }

  export type PendingActionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    channel: string | null
    kind: string | null
    corsairOperationPath: string | null
    status: string | null
    createdAt: Date | null
    resolvedAt: Date | null
  }

  export type PendingActionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    channel: string | null
    kind: string | null
    corsairOperationPath: string | null
    status: string | null
    createdAt: Date | null
    resolvedAt: Date | null
  }

  export type PendingActionCountAggregateOutputType = {
    id: number
    userId: number
    channel: number
    kind: number
    draftPayload: number
    corsairOperationPath: number
    status: number
    createdAt: number
    resolvedAt: number
    _all: number
  }


  export type PendingActionMinAggregateInputType = {
    id?: true
    userId?: true
    channel?: true
    kind?: true
    corsairOperationPath?: true
    status?: true
    createdAt?: true
    resolvedAt?: true
  }

  export type PendingActionMaxAggregateInputType = {
    id?: true
    userId?: true
    channel?: true
    kind?: true
    corsairOperationPath?: true
    status?: true
    createdAt?: true
    resolvedAt?: true
  }

  export type PendingActionCountAggregateInputType = {
    id?: true
    userId?: true
    channel?: true
    kind?: true
    draftPayload?: true
    corsairOperationPath?: true
    status?: true
    createdAt?: true
    resolvedAt?: true
    _all?: true
  }

  export type PendingActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingAction to aggregate.
     */
    where?: PendingActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingActions to fetch.
     */
    orderBy?: PendingActionOrderByWithRelationInput | PendingActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingActions
    **/
    _count?: true | PendingActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingActionMaxAggregateInputType
  }

  export type GetPendingActionAggregateType<T extends PendingActionAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingAction[P]>
      : GetScalarType<T[P], AggregatePendingAction[P]>
  }




  export type PendingActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingActionWhereInput
    orderBy?: PendingActionOrderByWithAggregationInput | PendingActionOrderByWithAggregationInput[]
    by: PendingActionScalarFieldEnum[] | PendingActionScalarFieldEnum
    having?: PendingActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingActionCountAggregateInputType | true
    _min?: PendingActionMinAggregateInputType
    _max?: PendingActionMaxAggregateInputType
  }

  export type PendingActionGroupByOutputType = {
    id: string
    userId: string
    channel: string
    kind: string
    draftPayload: JsonValue
    corsairOperationPath: string | null
    status: string
    createdAt: Date
    resolvedAt: Date | null
    _count: PendingActionCountAggregateOutputType | null
    _min: PendingActionMinAggregateOutputType | null
    _max: PendingActionMaxAggregateOutputType | null
  }

  type GetPendingActionGroupByPayload<T extends PendingActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingActionGroupByOutputType[P]>
            : GetScalarType<T[P], PendingActionGroupByOutputType[P]>
        }
      >
    >


  export type PendingActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channel?: boolean
    kind?: boolean
    draftPayload?: boolean
    corsairOperationPath?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pendingAction"]>

  export type PendingActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channel?: boolean
    kind?: boolean
    draftPayload?: boolean
    corsairOperationPath?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pendingAction"]>

  export type PendingActionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    channel?: boolean
    kind?: boolean
    draftPayload?: boolean
    corsairOperationPath?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pendingAction"]>

  export type PendingActionSelectScalar = {
    id?: boolean
    userId?: boolean
    channel?: boolean
    kind?: boolean
    draftPayload?: boolean
    corsairOperationPath?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
  }

  export type PendingActionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "channel" | "kind" | "draftPayload" | "corsairOperationPath" | "status" | "createdAt" | "resolvedAt", ExtArgs["result"]["pendingAction"]>
  export type PendingActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PendingActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PendingActionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PendingActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingAction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      channel: string
      kind: string
      draftPayload: Prisma.JsonValue
      corsairOperationPath: string | null
      status: string
      createdAt: Date
      resolvedAt: Date | null
    }, ExtArgs["result"]["pendingAction"]>
    composites: {}
  }

  type PendingActionGetPayload<S extends boolean | null | undefined | PendingActionDefaultArgs> = $Result.GetResult<Prisma.$PendingActionPayload, S>

  type PendingActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PendingActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PendingActionCountAggregateInputType | true
    }

  export interface PendingActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingAction'], meta: { name: 'PendingAction' } }
    /**
     * Find zero or one PendingAction that matches the filter.
     * @param {PendingActionFindUniqueArgs} args - Arguments to find a PendingAction
     * @example
     * // Get one PendingAction
     * const pendingAction = await prisma.pendingAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingActionFindUniqueArgs>(args: SelectSubset<T, PendingActionFindUniqueArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PendingAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PendingActionFindUniqueOrThrowArgs} args - Arguments to find a PendingAction
     * @example
     * // Get one PendingAction
     * const pendingAction = await prisma.pendingAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingActionFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionFindFirstArgs} args - Arguments to find a PendingAction
     * @example
     * // Get one PendingAction
     * const pendingAction = await prisma.pendingAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingActionFindFirstArgs>(args?: SelectSubset<T, PendingActionFindFirstArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionFindFirstOrThrowArgs} args - Arguments to find a PendingAction
     * @example
     * // Get one PendingAction
     * const pendingAction = await prisma.pendingAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingActionFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PendingActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingActions
     * const pendingActions = await prisma.pendingAction.findMany()
     * 
     * // Get first 10 PendingActions
     * const pendingActions = await prisma.pendingAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pendingActionWithIdOnly = await prisma.pendingAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PendingActionFindManyArgs>(args?: SelectSubset<T, PendingActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PendingAction.
     * @param {PendingActionCreateArgs} args - Arguments to create a PendingAction.
     * @example
     * // Create one PendingAction
     * const PendingAction = await prisma.pendingAction.create({
     *   data: {
     *     // ... data to create a PendingAction
     *   }
     * })
     * 
     */
    create<T extends PendingActionCreateArgs>(args: SelectSubset<T, PendingActionCreateArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PendingActions.
     * @param {PendingActionCreateManyArgs} args - Arguments to create many PendingActions.
     * @example
     * // Create many PendingActions
     * const pendingAction = await prisma.pendingAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingActionCreateManyArgs>(args?: SelectSubset<T, PendingActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PendingActions and returns the data saved in the database.
     * @param {PendingActionCreateManyAndReturnArgs} args - Arguments to create many PendingActions.
     * @example
     * // Create many PendingActions
     * const pendingAction = await prisma.pendingAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PendingActions and only return the `id`
     * const pendingActionWithIdOnly = await prisma.pendingAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PendingActionCreateManyAndReturnArgs>(args?: SelectSubset<T, PendingActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PendingAction.
     * @param {PendingActionDeleteArgs} args - Arguments to delete one PendingAction.
     * @example
     * // Delete one PendingAction
     * const PendingAction = await prisma.pendingAction.delete({
     *   where: {
     *     // ... filter to delete one PendingAction
     *   }
     * })
     * 
     */
    delete<T extends PendingActionDeleteArgs>(args: SelectSubset<T, PendingActionDeleteArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PendingAction.
     * @param {PendingActionUpdateArgs} args - Arguments to update one PendingAction.
     * @example
     * // Update one PendingAction
     * const pendingAction = await prisma.pendingAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingActionUpdateArgs>(args: SelectSubset<T, PendingActionUpdateArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PendingActions.
     * @param {PendingActionDeleteManyArgs} args - Arguments to filter PendingActions to delete.
     * @example
     * // Delete a few PendingActions
     * const { count } = await prisma.pendingAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingActionDeleteManyArgs>(args?: SelectSubset<T, PendingActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingActions
     * const pendingAction = await prisma.pendingAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingActionUpdateManyArgs>(args: SelectSubset<T, PendingActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingActions and returns the data updated in the database.
     * @param {PendingActionUpdateManyAndReturnArgs} args - Arguments to update many PendingActions.
     * @example
     * // Update many PendingActions
     * const pendingAction = await prisma.pendingAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PendingActions and only return the `id`
     * const pendingActionWithIdOnly = await prisma.pendingAction.updateManyAndReturn({
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
    updateManyAndReturn<T extends PendingActionUpdateManyAndReturnArgs>(args: SelectSubset<T, PendingActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PendingAction.
     * @param {PendingActionUpsertArgs} args - Arguments to update or create a PendingAction.
     * @example
     * // Update or create a PendingAction
     * const pendingAction = await prisma.pendingAction.upsert({
     *   create: {
     *     // ... data to create a PendingAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingAction we want to update
     *   }
     * })
     */
    upsert<T extends PendingActionUpsertArgs>(args: SelectSubset<T, PendingActionUpsertArgs<ExtArgs>>): Prisma__PendingActionClient<$Result.GetResult<Prisma.$PendingActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PendingActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionCountArgs} args - Arguments to filter PendingActions to count.
     * @example
     * // Count the number of PendingActions
     * const count = await prisma.pendingAction.count({
     *   where: {
     *     // ... the filter for the PendingActions we want to count
     *   }
     * })
    **/
    count<T extends PendingActionCountArgs>(
      args?: Subset<T, PendingActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PendingActionAggregateArgs>(args: Subset<T, PendingActionAggregateArgs>): Prisma.PrismaPromise<GetPendingActionAggregateType<T>>

    /**
     * Group by PendingAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingActionGroupByArgs} args - Group by arguments.
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
      T extends PendingActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingActionGroupByArgs['orderBy'] }
        : { orderBy?: PendingActionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PendingActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingAction model
   */
  readonly fields: PendingActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PendingAction model
   */
  interface PendingActionFieldRefs {
    readonly id: FieldRef<"PendingAction", 'String'>
    readonly userId: FieldRef<"PendingAction", 'String'>
    readonly channel: FieldRef<"PendingAction", 'String'>
    readonly kind: FieldRef<"PendingAction", 'String'>
    readonly draftPayload: FieldRef<"PendingAction", 'Json'>
    readonly corsairOperationPath: FieldRef<"PendingAction", 'String'>
    readonly status: FieldRef<"PendingAction", 'String'>
    readonly createdAt: FieldRef<"PendingAction", 'DateTime'>
    readonly resolvedAt: FieldRef<"PendingAction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PendingAction findUnique
   */
  export type PendingActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * Filter, which PendingAction to fetch.
     */
    where: PendingActionWhereUniqueInput
  }

  /**
   * PendingAction findUniqueOrThrow
   */
  export type PendingActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * Filter, which PendingAction to fetch.
     */
    where: PendingActionWhereUniqueInput
  }

  /**
   * PendingAction findFirst
   */
  export type PendingActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * Filter, which PendingAction to fetch.
     */
    where?: PendingActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingActions to fetch.
     */
    orderBy?: PendingActionOrderByWithRelationInput | PendingActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingActions.
     */
    cursor?: PendingActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingActions.
     */
    distinct?: PendingActionScalarFieldEnum | PendingActionScalarFieldEnum[]
  }

  /**
   * PendingAction findFirstOrThrow
   */
  export type PendingActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * Filter, which PendingAction to fetch.
     */
    where?: PendingActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingActions to fetch.
     */
    orderBy?: PendingActionOrderByWithRelationInput | PendingActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingActions.
     */
    cursor?: PendingActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingActions.
     */
    distinct?: PendingActionScalarFieldEnum | PendingActionScalarFieldEnum[]
  }

  /**
   * PendingAction findMany
   */
  export type PendingActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * Filter, which PendingActions to fetch.
     */
    where?: PendingActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingActions to fetch.
     */
    orderBy?: PendingActionOrderByWithRelationInput | PendingActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingActions.
     */
    cursor?: PendingActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingActions.
     */
    skip?: number
    distinct?: PendingActionScalarFieldEnum | PendingActionScalarFieldEnum[]
  }

  /**
   * PendingAction create
   */
  export type PendingActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * The data needed to create a PendingAction.
     */
    data: XOR<PendingActionCreateInput, PendingActionUncheckedCreateInput>
  }

  /**
   * PendingAction createMany
   */
  export type PendingActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingActions.
     */
    data: PendingActionCreateManyInput | PendingActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PendingAction createManyAndReturn
   */
  export type PendingActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * The data used to create many PendingActions.
     */
    data: PendingActionCreateManyInput | PendingActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PendingAction update
   */
  export type PendingActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * The data needed to update a PendingAction.
     */
    data: XOR<PendingActionUpdateInput, PendingActionUncheckedUpdateInput>
    /**
     * Choose, which PendingAction to update.
     */
    where: PendingActionWhereUniqueInput
  }

  /**
   * PendingAction updateMany
   */
  export type PendingActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingActions.
     */
    data: XOR<PendingActionUpdateManyMutationInput, PendingActionUncheckedUpdateManyInput>
    /**
     * Filter which PendingActions to update
     */
    where?: PendingActionWhereInput
    /**
     * Limit how many PendingActions to update.
     */
    limit?: number
  }

  /**
   * PendingAction updateManyAndReturn
   */
  export type PendingActionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * The data used to update PendingActions.
     */
    data: XOR<PendingActionUpdateManyMutationInput, PendingActionUncheckedUpdateManyInput>
    /**
     * Filter which PendingActions to update
     */
    where?: PendingActionWhereInput
    /**
     * Limit how many PendingActions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PendingAction upsert
   */
  export type PendingActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * The filter to search for the PendingAction to update in case it exists.
     */
    where: PendingActionWhereUniqueInput
    /**
     * In case the PendingAction found by the `where` argument doesn't exist, create a new PendingAction with this data.
     */
    create: XOR<PendingActionCreateInput, PendingActionUncheckedCreateInput>
    /**
     * In case the PendingAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingActionUpdateInput, PendingActionUncheckedUpdateInput>
  }

  /**
   * PendingAction delete
   */
  export type PendingActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
    /**
     * Filter which PendingAction to delete.
     */
    where: PendingActionWhereUniqueInput
  }

  /**
   * PendingAction deleteMany
   */
  export type PendingActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingActions to delete
     */
    where?: PendingActionWhereInput
    /**
     * Limit how many PendingActions to delete.
     */
    limit?: number
  }

  /**
   * PendingAction without action
   */
  export type PendingActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingAction
     */
    select?: PendingActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingAction
     */
    omit?: PendingActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingActionInclude<ExtArgs> | null
  }


  /**
   * Model UserPreference
   */

  export type AggregateUserPreference = {
    _count: UserPreferenceCountAggregateOutputType | null
    _min: UserPreferenceMinAggregateOutputType | null
    _max: UserPreferenceMaxAggregateOutputType | null
  }

  export type UserPreferenceMinAggregateOutputType = {
    id: string | null
    userId: string | null
  }

  export type UserPreferenceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
  }

  export type UserPreferenceCountAggregateOutputType = {
    id: number
    userId: number
    splitInboxRules: number
    shortcutOverrides: number
    _all: number
  }


  export type UserPreferenceMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UserPreferenceMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UserPreferenceCountAggregateInputType = {
    id?: true
    userId?: true
    splitInboxRules?: true
    shortcutOverrides?: true
    _all?: true
  }

  export type UserPreferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPreference to aggregate.
     */
    where?: UserPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     */
    orderBy?: UserPreferenceOrderByWithRelationInput | UserPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPreferences
    **/
    _count?: true | UserPreferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPreferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPreferenceMaxAggregateInputType
  }

  export type GetUserPreferenceAggregateType<T extends UserPreferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPreference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPreference[P]>
      : GetScalarType<T[P], AggregateUserPreference[P]>
  }




  export type UserPreferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPreferenceWhereInput
    orderBy?: UserPreferenceOrderByWithAggregationInput | UserPreferenceOrderByWithAggregationInput[]
    by: UserPreferenceScalarFieldEnum[] | UserPreferenceScalarFieldEnum
    having?: UserPreferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPreferenceCountAggregateInputType | true
    _min?: UserPreferenceMinAggregateInputType
    _max?: UserPreferenceMaxAggregateInputType
  }

  export type UserPreferenceGroupByOutputType = {
    id: string
    userId: string
    splitInboxRules: JsonValue
    shortcutOverrides: JsonValue
    _count: UserPreferenceCountAggregateOutputType | null
    _min: UserPreferenceMinAggregateOutputType | null
    _max: UserPreferenceMaxAggregateOutputType | null
  }

  type GetUserPreferenceGroupByPayload<T extends UserPreferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPreferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPreferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPreferenceGroupByOutputType[P]>
            : GetScalarType<T[P], UserPreferenceGroupByOutputType[P]>
        }
      >
    >


  export type UserPreferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    splitInboxRules?: boolean
    shortcutOverrides?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPreference"]>

  export type UserPreferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    splitInboxRules?: boolean
    shortcutOverrides?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPreference"]>

  export type UserPreferenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    splitInboxRules?: boolean
    shortcutOverrides?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPreference"]>

  export type UserPreferenceSelectScalar = {
    id?: boolean
    userId?: boolean
    splitInboxRules?: boolean
    shortcutOverrides?: boolean
  }

  export type UserPreferenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "splitInboxRules" | "shortcutOverrides", ExtArgs["result"]["userPreference"]>
  export type UserPreferenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPreferenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPreferenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserPreferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPreference"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      splitInboxRules: Prisma.JsonValue
      shortcutOverrides: Prisma.JsonValue
    }, ExtArgs["result"]["userPreference"]>
    composites: {}
  }

  type UserPreferenceGetPayload<S extends boolean | null | undefined | UserPreferenceDefaultArgs> = $Result.GetResult<Prisma.$UserPreferencePayload, S>

  type UserPreferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserPreferenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserPreferenceCountAggregateInputType | true
    }

  export interface UserPreferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPreference'], meta: { name: 'UserPreference' } }
    /**
     * Find zero or one UserPreference that matches the filter.
     * @param {UserPreferenceFindUniqueArgs} args - Arguments to find a UserPreference
     * @example
     * // Get one UserPreference
     * const userPreference = await prisma.userPreference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPreferenceFindUniqueArgs>(args: SelectSubset<T, UserPreferenceFindUniqueArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserPreference that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPreferenceFindUniqueOrThrowArgs} args - Arguments to find a UserPreference
     * @example
     * // Get one UserPreference
     * const userPreference = await prisma.userPreference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPreferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPreferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPreference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceFindFirstArgs} args - Arguments to find a UserPreference
     * @example
     * // Get one UserPreference
     * const userPreference = await prisma.userPreference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPreferenceFindFirstArgs>(args?: SelectSubset<T, UserPreferenceFindFirstArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPreference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceFindFirstOrThrowArgs} args - Arguments to find a UserPreference
     * @example
     * // Get one UserPreference
     * const userPreference = await prisma.userPreference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPreferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPreferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPreferences
     * const userPreferences = await prisma.userPreference.findMany()
     * 
     * // Get first 10 UserPreferences
     * const userPreferences = await prisma.userPreference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPreferenceWithIdOnly = await prisma.userPreference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserPreferenceFindManyArgs>(args?: SelectSubset<T, UserPreferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserPreference.
     * @param {UserPreferenceCreateArgs} args - Arguments to create a UserPreference.
     * @example
     * // Create one UserPreference
     * const UserPreference = await prisma.userPreference.create({
     *   data: {
     *     // ... data to create a UserPreference
     *   }
     * })
     * 
     */
    create<T extends UserPreferenceCreateArgs>(args: SelectSubset<T, UserPreferenceCreateArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPreferences.
     * @param {UserPreferenceCreateManyArgs} args - Arguments to create many UserPreferences.
     * @example
     * // Create many UserPreferences
     * const userPreference = await prisma.userPreference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPreferenceCreateManyArgs>(args?: SelectSubset<T, UserPreferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPreferences and returns the data saved in the database.
     * @param {UserPreferenceCreateManyAndReturnArgs} args - Arguments to create many UserPreferences.
     * @example
     * // Create many UserPreferences
     * const userPreference = await prisma.userPreference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPreferences and only return the `id`
     * const userPreferenceWithIdOnly = await prisma.userPreference.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPreferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPreferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserPreference.
     * @param {UserPreferenceDeleteArgs} args - Arguments to delete one UserPreference.
     * @example
     * // Delete one UserPreference
     * const UserPreference = await prisma.userPreference.delete({
     *   where: {
     *     // ... filter to delete one UserPreference
     *   }
     * })
     * 
     */
    delete<T extends UserPreferenceDeleteArgs>(args: SelectSubset<T, UserPreferenceDeleteArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserPreference.
     * @param {UserPreferenceUpdateArgs} args - Arguments to update one UserPreference.
     * @example
     * // Update one UserPreference
     * const userPreference = await prisma.userPreference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPreferenceUpdateArgs>(args: SelectSubset<T, UserPreferenceUpdateArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPreferences.
     * @param {UserPreferenceDeleteManyArgs} args - Arguments to filter UserPreferences to delete.
     * @example
     * // Delete a few UserPreferences
     * const { count } = await prisma.userPreference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPreferenceDeleteManyArgs>(args?: SelectSubset<T, UserPreferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPreferences
     * const userPreference = await prisma.userPreference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPreferenceUpdateManyArgs>(args: SelectSubset<T, UserPreferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPreferences and returns the data updated in the database.
     * @param {UserPreferenceUpdateManyAndReturnArgs} args - Arguments to update many UserPreferences.
     * @example
     * // Update many UserPreferences
     * const userPreference = await prisma.userPreference.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserPreferences and only return the `id`
     * const userPreferenceWithIdOnly = await prisma.userPreference.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserPreferenceUpdateManyAndReturnArgs>(args: SelectSubset<T, UserPreferenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserPreference.
     * @param {UserPreferenceUpsertArgs} args - Arguments to update or create a UserPreference.
     * @example
     * // Update or create a UserPreference
     * const userPreference = await prisma.userPreference.upsert({
     *   create: {
     *     // ... data to create a UserPreference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPreference we want to update
     *   }
     * })
     */
    upsert<T extends UserPreferenceUpsertArgs>(args: SelectSubset<T, UserPreferenceUpsertArgs<ExtArgs>>): Prisma__UserPreferenceClient<$Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceCountArgs} args - Arguments to filter UserPreferences to count.
     * @example
     * // Count the number of UserPreferences
     * const count = await prisma.userPreference.count({
     *   where: {
     *     // ... the filter for the UserPreferences we want to count
     *   }
     * })
    **/
    count<T extends UserPreferenceCountArgs>(
      args?: Subset<T, UserPreferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPreferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserPreferenceAggregateArgs>(args: Subset<T, UserPreferenceAggregateArgs>): Prisma.PrismaPromise<GetUserPreferenceAggregateType<T>>

    /**
     * Group by UserPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferenceGroupByArgs} args - Group by arguments.
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
      T extends UserPreferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPreferenceGroupByArgs['orderBy'] }
        : { orderBy?: UserPreferenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserPreferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPreferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPreference model
   */
  readonly fields: UserPreferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPreference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPreferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserPreference model
   */
  interface UserPreferenceFieldRefs {
    readonly id: FieldRef<"UserPreference", 'String'>
    readonly userId: FieldRef<"UserPreference", 'String'>
    readonly splitInboxRules: FieldRef<"UserPreference", 'Json'>
    readonly shortcutOverrides: FieldRef<"UserPreference", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * UserPreference findUnique
   */
  export type UserPreferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPreference to fetch.
     */
    where: UserPreferenceWhereUniqueInput
  }

  /**
   * UserPreference findUniqueOrThrow
   */
  export type UserPreferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPreference to fetch.
     */
    where: UserPreferenceWhereUniqueInput
  }

  /**
   * UserPreference findFirst
   */
  export type UserPreferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPreference to fetch.
     */
    where?: UserPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     */
    orderBy?: UserPreferenceOrderByWithRelationInput | UserPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPreferences.
     */
    cursor?: UserPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPreferences.
     */
    distinct?: UserPreferenceScalarFieldEnum | UserPreferenceScalarFieldEnum[]
  }

  /**
   * UserPreference findFirstOrThrow
   */
  export type UserPreferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPreference to fetch.
     */
    where?: UserPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     */
    orderBy?: UserPreferenceOrderByWithRelationInput | UserPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPreferences.
     */
    cursor?: UserPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPreferences.
     */
    distinct?: UserPreferenceScalarFieldEnum | UserPreferenceScalarFieldEnum[]
  }

  /**
   * UserPreference findMany
   */
  export type UserPreferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPreferences to fetch.
     */
    where?: UserPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     */
    orderBy?: UserPreferenceOrderByWithRelationInput | UserPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPreferences.
     */
    cursor?: UserPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     */
    skip?: number
    distinct?: UserPreferenceScalarFieldEnum | UserPreferenceScalarFieldEnum[]
  }

  /**
   * UserPreference create
   */
  export type UserPreferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPreference.
     */
    data: XOR<UserPreferenceCreateInput, UserPreferenceUncheckedCreateInput>
  }

  /**
   * UserPreference createMany
   */
  export type UserPreferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPreferences.
     */
    data: UserPreferenceCreateManyInput | UserPreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPreference createManyAndReturn
   */
  export type UserPreferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * The data used to create many UserPreferences.
     */
    data: UserPreferenceCreateManyInput | UserPreferenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPreference update
   */
  export type UserPreferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPreference.
     */
    data: XOR<UserPreferenceUpdateInput, UserPreferenceUncheckedUpdateInput>
    /**
     * Choose, which UserPreference to update.
     */
    where: UserPreferenceWhereUniqueInput
  }

  /**
   * UserPreference updateMany
   */
  export type UserPreferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPreferences.
     */
    data: XOR<UserPreferenceUpdateManyMutationInput, UserPreferenceUncheckedUpdateManyInput>
    /**
     * Filter which UserPreferences to update
     */
    where?: UserPreferenceWhereInput
    /**
     * Limit how many UserPreferences to update.
     */
    limit?: number
  }

  /**
   * UserPreference updateManyAndReturn
   */
  export type UserPreferenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * The data used to update UserPreferences.
     */
    data: XOR<UserPreferenceUpdateManyMutationInput, UserPreferenceUncheckedUpdateManyInput>
    /**
     * Filter which UserPreferences to update
     */
    where?: UserPreferenceWhereInput
    /**
     * Limit how many UserPreferences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPreference upsert
   */
  export type UserPreferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPreference to update in case it exists.
     */
    where: UserPreferenceWhereUniqueInput
    /**
     * In case the UserPreference found by the `where` argument doesn't exist, create a new UserPreference with this data.
     */
    create: XOR<UserPreferenceCreateInput, UserPreferenceUncheckedCreateInput>
    /**
     * In case the UserPreference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPreferenceUpdateInput, UserPreferenceUncheckedUpdateInput>
  }

  /**
   * UserPreference delete
   */
  export type UserPreferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
    /**
     * Filter which UserPreference to delete.
     */
    where: UserPreferenceWhereUniqueInput
  }

  /**
   * UserPreference deleteMany
   */
  export type UserPreferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPreferences to delete
     */
    where?: UserPreferenceWhereInput
    /**
     * Limit how many UserPreferences to delete.
     */
    limit?: number
  }

  /**
   * UserPreference without action
   */
  export type UserPreferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPreference
     */
    select?: UserPreferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPreference
     */
    omit?: UserPreferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPreferenceInclude<ExtArgs> | null
  }


  /**
   * Model SyncItem
   */

  export type AggregateSyncItem = {
    _count: SyncItemCountAggregateOutputType | null
    _min: SyncItemMinAggregateOutputType | null
    _max: SyncItemMaxAggregateOutputType | null
  }

  export type SyncItemMinAggregateOutputType = {
    id: string | null
    userId: string | null
    corsairEntityId: string | null
    type: string | null
    title: string | null
    snippet: string | null
    timestamp: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncItemMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    corsairEntityId: string | null
    type: string | null
    title: string | null
    snippet: string | null
    timestamp: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncItemCountAggregateOutputType = {
    id: number
    userId: number
    corsairEntityId: number
    type: number
    title: number
    snippet: number
    timestamp: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SyncItemMinAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    type?: true
    title?: true
    snippet?: true
    timestamp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncItemMaxAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    type?: true
    title?: true
    snippet?: true
    timestamp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncItemCountAggregateInputType = {
    id?: true
    userId?: true
    corsairEntityId?: true
    type?: true
    title?: true
    snippet?: true
    timestamp?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncItem to aggregate.
     */
    where?: SyncItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncItems to fetch.
     */
    orderBy?: SyncItemOrderByWithRelationInput | SyncItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncItems
    **/
    _count?: true | SyncItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncItemMaxAggregateInputType
  }

  export type GetSyncItemAggregateType<T extends SyncItemAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncItem[P]>
      : GetScalarType<T[P], AggregateSyncItem[P]>
  }




  export type SyncItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncItemWhereInput
    orderBy?: SyncItemOrderByWithAggregationInput | SyncItemOrderByWithAggregationInput[]
    by: SyncItemScalarFieldEnum[] | SyncItemScalarFieldEnum
    having?: SyncItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncItemCountAggregateInputType | true
    _min?: SyncItemMinAggregateInputType
    _max?: SyncItemMaxAggregateInputType
  }

  export type SyncItemGroupByOutputType = {
    id: string
    userId: string
    corsairEntityId: string
    type: string
    title: string
    snippet: string
    timestamp: Date
    createdAt: Date
    updatedAt: Date
    _count: SyncItemCountAggregateOutputType | null
    _min: SyncItemMinAggregateOutputType | null
    _max: SyncItemMaxAggregateOutputType | null
  }

  type GetSyncItemGroupByPayload<T extends SyncItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncItemGroupByOutputType[P]>
            : GetScalarType<T[P], SyncItemGroupByOutputType[P]>
        }
      >
    >


  export type SyncItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    type?: boolean
    title?: boolean
    snippet?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncItem"]>

  export type SyncItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    type?: boolean
    title?: boolean
    snippet?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncItem"]>

  export type SyncItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    type?: boolean
    title?: boolean
    snippet?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncItem"]>

  export type SyncItemSelectScalar = {
    id?: boolean
    userId?: boolean
    corsairEntityId?: boolean
    type?: boolean
    title?: boolean
    snippet?: boolean
    timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SyncItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "corsairEntityId" | "type" | "title" | "snippet" | "timestamp" | "createdAt" | "updatedAt", ExtArgs["result"]["syncItem"]>

  export type $SyncItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      corsairEntityId: string
      type: string
      title: string
      snippet: string
      timestamp: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["syncItem"]>
    composites: {}
  }

  type SyncItemGetPayload<S extends boolean | null | undefined | SyncItemDefaultArgs> = $Result.GetResult<Prisma.$SyncItemPayload, S>

  type SyncItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncItemCountAggregateInputType | true
    }

  export interface SyncItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncItem'], meta: { name: 'SyncItem' } }
    /**
     * Find zero or one SyncItem that matches the filter.
     * @param {SyncItemFindUniqueArgs} args - Arguments to find a SyncItem
     * @example
     * // Get one SyncItem
     * const syncItem = await prisma.syncItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncItemFindUniqueArgs>(args: SelectSubset<T, SyncItemFindUniqueArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncItemFindUniqueOrThrowArgs} args - Arguments to find a SyncItem
     * @example
     * // Get one SyncItem
     * const syncItem = await prisma.syncItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncItemFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemFindFirstArgs} args - Arguments to find a SyncItem
     * @example
     * // Get one SyncItem
     * const syncItem = await prisma.syncItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncItemFindFirstArgs>(args?: SelectSubset<T, SyncItemFindFirstArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemFindFirstOrThrowArgs} args - Arguments to find a SyncItem
     * @example
     * // Get one SyncItem
     * const syncItem = await prisma.syncItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncItemFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncItems
     * const syncItems = await prisma.syncItem.findMany()
     * 
     * // Get first 10 SyncItems
     * const syncItems = await prisma.syncItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncItemWithIdOnly = await prisma.syncItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncItemFindManyArgs>(args?: SelectSubset<T, SyncItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncItem.
     * @param {SyncItemCreateArgs} args - Arguments to create a SyncItem.
     * @example
     * // Create one SyncItem
     * const SyncItem = await prisma.syncItem.create({
     *   data: {
     *     // ... data to create a SyncItem
     *   }
     * })
     * 
     */
    create<T extends SyncItemCreateArgs>(args: SelectSubset<T, SyncItemCreateArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncItems.
     * @param {SyncItemCreateManyArgs} args - Arguments to create many SyncItems.
     * @example
     * // Create many SyncItems
     * const syncItem = await prisma.syncItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncItemCreateManyArgs>(args?: SelectSubset<T, SyncItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncItems and returns the data saved in the database.
     * @param {SyncItemCreateManyAndReturnArgs} args - Arguments to create many SyncItems.
     * @example
     * // Create many SyncItems
     * const syncItem = await prisma.syncItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncItems and only return the `id`
     * const syncItemWithIdOnly = await prisma.syncItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncItemCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncItem.
     * @param {SyncItemDeleteArgs} args - Arguments to delete one SyncItem.
     * @example
     * // Delete one SyncItem
     * const SyncItem = await prisma.syncItem.delete({
     *   where: {
     *     // ... filter to delete one SyncItem
     *   }
     * })
     * 
     */
    delete<T extends SyncItemDeleteArgs>(args: SelectSubset<T, SyncItemDeleteArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncItem.
     * @param {SyncItemUpdateArgs} args - Arguments to update one SyncItem.
     * @example
     * // Update one SyncItem
     * const syncItem = await prisma.syncItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncItemUpdateArgs>(args: SelectSubset<T, SyncItemUpdateArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncItems.
     * @param {SyncItemDeleteManyArgs} args - Arguments to filter SyncItems to delete.
     * @example
     * // Delete a few SyncItems
     * const { count } = await prisma.syncItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncItemDeleteManyArgs>(args?: SelectSubset<T, SyncItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncItems
     * const syncItem = await prisma.syncItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncItemUpdateManyArgs>(args: SelectSubset<T, SyncItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncItems and returns the data updated in the database.
     * @param {SyncItemUpdateManyAndReturnArgs} args - Arguments to update many SyncItems.
     * @example
     * // Update many SyncItems
     * const syncItem = await prisma.syncItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncItems and only return the `id`
     * const syncItemWithIdOnly = await prisma.syncItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends SyncItemUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncItem.
     * @param {SyncItemUpsertArgs} args - Arguments to update or create a SyncItem.
     * @example
     * // Update or create a SyncItem
     * const syncItem = await prisma.syncItem.upsert({
     *   create: {
     *     // ... data to create a SyncItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncItem we want to update
     *   }
     * })
     */
    upsert<T extends SyncItemUpsertArgs>(args: SelectSubset<T, SyncItemUpsertArgs<ExtArgs>>): Prisma__SyncItemClient<$Result.GetResult<Prisma.$SyncItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemCountArgs} args - Arguments to filter SyncItems to count.
     * @example
     * // Count the number of SyncItems
     * const count = await prisma.syncItem.count({
     *   where: {
     *     // ... the filter for the SyncItems we want to count
     *   }
     * })
    **/
    count<T extends SyncItemCountArgs>(
      args?: Subset<T, SyncItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SyncItemAggregateArgs>(args: Subset<T, SyncItemAggregateArgs>): Prisma.PrismaPromise<GetSyncItemAggregateType<T>>

    /**
     * Group by SyncItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncItemGroupByArgs} args - Group by arguments.
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
      T extends SyncItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncItemGroupByArgs['orderBy'] }
        : { orderBy?: SyncItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SyncItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncItem model
   */
  readonly fields: SyncItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SyncItem model
   */
  interface SyncItemFieldRefs {
    readonly id: FieldRef<"SyncItem", 'String'>
    readonly userId: FieldRef<"SyncItem", 'String'>
    readonly corsairEntityId: FieldRef<"SyncItem", 'String'>
    readonly type: FieldRef<"SyncItem", 'String'>
    readonly title: FieldRef<"SyncItem", 'String'>
    readonly snippet: FieldRef<"SyncItem", 'String'>
    readonly timestamp: FieldRef<"SyncItem", 'DateTime'>
    readonly createdAt: FieldRef<"SyncItem", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncItem findUnique
   */
  export type SyncItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncItem to fetch.
     */
    where: SyncItemWhereUniqueInput
  }

  /**
   * SyncItem findUniqueOrThrow
   */
  export type SyncItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncItem to fetch.
     */
    where: SyncItemWhereUniqueInput
  }

  /**
   * SyncItem findFirst
   */
  export type SyncItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncItem to fetch.
     */
    where?: SyncItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncItems to fetch.
     */
    orderBy?: SyncItemOrderByWithRelationInput | SyncItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncItems.
     */
    cursor?: SyncItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncItems.
     */
    distinct?: SyncItemScalarFieldEnum | SyncItemScalarFieldEnum[]
  }

  /**
   * SyncItem findFirstOrThrow
   */
  export type SyncItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncItem to fetch.
     */
    where?: SyncItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncItems to fetch.
     */
    orderBy?: SyncItemOrderByWithRelationInput | SyncItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncItems.
     */
    cursor?: SyncItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncItems.
     */
    distinct?: SyncItemScalarFieldEnum | SyncItemScalarFieldEnum[]
  }

  /**
   * SyncItem findMany
   */
  export type SyncItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncItems to fetch.
     */
    where?: SyncItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncItems to fetch.
     */
    orderBy?: SyncItemOrderByWithRelationInput | SyncItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncItems.
     */
    cursor?: SyncItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncItems.
     */
    skip?: number
    distinct?: SyncItemScalarFieldEnum | SyncItemScalarFieldEnum[]
  }

  /**
   * SyncItem create
   */
  export type SyncItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * The data needed to create a SyncItem.
     */
    data: XOR<SyncItemCreateInput, SyncItemUncheckedCreateInput>
  }

  /**
   * SyncItem createMany
   */
  export type SyncItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncItems.
     */
    data: SyncItemCreateManyInput | SyncItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SyncItem createManyAndReturn
   */
  export type SyncItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * The data used to create many SyncItems.
     */
    data: SyncItemCreateManyInput | SyncItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SyncItem update
   */
  export type SyncItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * The data needed to update a SyncItem.
     */
    data: XOR<SyncItemUpdateInput, SyncItemUncheckedUpdateInput>
    /**
     * Choose, which SyncItem to update.
     */
    where: SyncItemWhereUniqueInput
  }

  /**
   * SyncItem updateMany
   */
  export type SyncItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncItems.
     */
    data: XOR<SyncItemUpdateManyMutationInput, SyncItemUncheckedUpdateManyInput>
    /**
     * Filter which SyncItems to update
     */
    where?: SyncItemWhereInput
    /**
     * Limit how many SyncItems to update.
     */
    limit?: number
  }

  /**
   * SyncItem updateManyAndReturn
   */
  export type SyncItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * The data used to update SyncItems.
     */
    data: XOR<SyncItemUpdateManyMutationInput, SyncItemUncheckedUpdateManyInput>
    /**
     * Filter which SyncItems to update
     */
    where?: SyncItemWhereInput
    /**
     * Limit how many SyncItems to update.
     */
    limit?: number
  }

  /**
   * SyncItem upsert
   */
  export type SyncItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * The filter to search for the SyncItem to update in case it exists.
     */
    where: SyncItemWhereUniqueInput
    /**
     * In case the SyncItem found by the `where` argument doesn't exist, create a new SyncItem with this data.
     */
    create: XOR<SyncItemCreateInput, SyncItemUncheckedCreateInput>
    /**
     * In case the SyncItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncItemUpdateInput, SyncItemUncheckedUpdateInput>
  }

  /**
   * SyncItem delete
   */
  export type SyncItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
    /**
     * Filter which SyncItem to delete.
     */
    where: SyncItemWhereUniqueInput
  }

  /**
   * SyncItem deleteMany
   */
  export type SyncItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncItems to delete
     */
    where?: SyncItemWhereInput
    /**
     * Limit how many SyncItems to delete.
     */
    limit?: number
  }

  /**
   * SyncItem without action
   */
  export type SyncItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncItem
     */
    select?: SyncItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncItem
     */
    omit?: SyncItemOmit<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    gmailBackfilledAt: 'gmailBackfilledAt',
    calendarBackfilledAt: 'calendarBackfilledAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ChannelLinkScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    channel: 'channel',
    externalChatId: 'externalChatId',
    linkedAt: 'linkedAt'
  };

  export type ChannelLinkScalarFieldEnum = (typeof ChannelLinkScalarFieldEnum)[keyof typeof ChannelLinkScalarFieldEnum]


  export const EmailEmbeddingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    corsairEntityId: 'corsairEntityId',
    threadId: 'threadId',
    subjectSnippet: 'subjectSnippet',
    indexedAt: 'indexedAt'
  };

  export type EmailEmbeddingScalarFieldEnum = (typeof EmailEmbeddingScalarFieldEnum)[keyof typeof EmailEmbeddingScalarFieldEnum]


  export const PriorityScoreScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    corsairEntityId: 'corsairEntityId',
    threadId: 'threadId',
    label: 'label',
    reason: 'reason',
    model: 'model',
    createdAt: 'createdAt'
  };

  export type PriorityScoreScalarFieldEnum = (typeof PriorityScoreScalarFieldEnum)[keyof typeof PriorityScoreScalarFieldEnum]


  export const PendingActionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    channel: 'channel',
    kind: 'kind',
    draftPayload: 'draftPayload',
    corsairOperationPath: 'corsairOperationPath',
    status: 'status',
    createdAt: 'createdAt',
    resolvedAt: 'resolvedAt'
  };

  export type PendingActionScalarFieldEnum = (typeof PendingActionScalarFieldEnum)[keyof typeof PendingActionScalarFieldEnum]


  export const UserPreferenceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    splitInboxRules: 'splitInboxRules',
    shortcutOverrides: 'shortcutOverrides'
  };

  export type UserPreferenceScalarFieldEnum = (typeof UserPreferenceScalarFieldEnum)[keyof typeof UserPreferenceScalarFieldEnum]


  export const SyncItemScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    corsairEntityId: 'corsairEntityId',
    type: 'type',
    title: 'title',
    snippet: 'snippet',
    timestamp: 'timestamp',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SyncItemScalarFieldEnum = (typeof SyncItemScalarFieldEnum)[keyof typeof SyncItemScalarFieldEnum]


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

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    gmailBackfilledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    calendarBackfilledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    channelLinks?: ChannelLinkListRelationFilter
    emailEmbeddings?: EmailEmbeddingListRelationFilter
    priorityScores?: PriorityScoreListRelationFilter
    pendingActions?: PendingActionListRelationFilter
    preference?: XOR<UserPreferenceNullableScalarRelationFilter, UserPreferenceWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gmailBackfilledAt?: SortOrderInput | SortOrder
    calendarBackfilledAt?: SortOrderInput | SortOrder
    channelLinks?: ChannelLinkOrderByRelationAggregateInput
    emailEmbeddings?: EmailEmbeddingOrderByRelationAggregateInput
    priorityScores?: PriorityScoreOrderByRelationAggregateInput
    pendingActions?: PendingActionOrderByRelationAggregateInput
    preference?: UserPreferenceOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    gmailBackfilledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    calendarBackfilledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    channelLinks?: ChannelLinkListRelationFilter
    emailEmbeddings?: EmailEmbeddingListRelationFilter
    priorityScores?: PriorityScoreListRelationFilter
    pendingActions?: PendingActionListRelationFilter
    preference?: XOR<UserPreferenceNullableScalarRelationFilter, UserPreferenceWhereInput> | null
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gmailBackfilledAt?: SortOrderInput | SortOrder
    calendarBackfilledAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    gmailBackfilledAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    calendarBackfilledAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type ChannelLinkWhereInput = {
    AND?: ChannelLinkWhereInput | ChannelLinkWhereInput[]
    OR?: ChannelLinkWhereInput[]
    NOT?: ChannelLinkWhereInput | ChannelLinkWhereInput[]
    id?: StringFilter<"ChannelLink"> | string
    userId?: StringFilter<"ChannelLink"> | string
    channel?: StringFilter<"ChannelLink"> | string
    externalChatId?: StringFilter<"ChannelLink"> | string
    linkedAt?: DateTimeFilter<"ChannelLink"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ChannelLinkOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    externalChatId?: SortOrder
    linkedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ChannelLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    channel_externalChatId?: ChannelLinkChannelExternalChatIdCompoundUniqueInput
    AND?: ChannelLinkWhereInput | ChannelLinkWhereInput[]
    OR?: ChannelLinkWhereInput[]
    NOT?: ChannelLinkWhereInput | ChannelLinkWhereInput[]
    userId?: StringFilter<"ChannelLink"> | string
    channel?: StringFilter<"ChannelLink"> | string
    externalChatId?: StringFilter<"ChannelLink"> | string
    linkedAt?: DateTimeFilter<"ChannelLink"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "channel_externalChatId">

  export type ChannelLinkOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    externalChatId?: SortOrder
    linkedAt?: SortOrder
    _count?: ChannelLinkCountOrderByAggregateInput
    _max?: ChannelLinkMaxOrderByAggregateInput
    _min?: ChannelLinkMinOrderByAggregateInput
  }

  export type ChannelLinkScalarWhereWithAggregatesInput = {
    AND?: ChannelLinkScalarWhereWithAggregatesInput | ChannelLinkScalarWhereWithAggregatesInput[]
    OR?: ChannelLinkScalarWhereWithAggregatesInput[]
    NOT?: ChannelLinkScalarWhereWithAggregatesInput | ChannelLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChannelLink"> | string
    userId?: StringWithAggregatesFilter<"ChannelLink"> | string
    channel?: StringWithAggregatesFilter<"ChannelLink"> | string
    externalChatId?: StringWithAggregatesFilter<"ChannelLink"> | string
    linkedAt?: DateTimeWithAggregatesFilter<"ChannelLink"> | Date | string
  }

  export type EmailEmbeddingWhereInput = {
    AND?: EmailEmbeddingWhereInput | EmailEmbeddingWhereInput[]
    OR?: EmailEmbeddingWhereInput[]
    NOT?: EmailEmbeddingWhereInput | EmailEmbeddingWhereInput[]
    id?: StringFilter<"EmailEmbedding"> | string
    userId?: StringFilter<"EmailEmbedding"> | string
    corsairEntityId?: StringFilter<"EmailEmbedding"> | string
    threadId?: StringFilter<"EmailEmbedding"> | string
    subjectSnippet?: StringFilter<"EmailEmbedding"> | string
    indexedAt?: DateTimeFilter<"EmailEmbedding"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type EmailEmbeddingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    subjectSnippet?: SortOrder
    indexedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type EmailEmbeddingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_corsairEntityId?: EmailEmbeddingUserIdCorsairEntityIdCompoundUniqueInput
    AND?: EmailEmbeddingWhereInput | EmailEmbeddingWhereInput[]
    OR?: EmailEmbeddingWhereInput[]
    NOT?: EmailEmbeddingWhereInput | EmailEmbeddingWhereInput[]
    userId?: StringFilter<"EmailEmbedding"> | string
    corsairEntityId?: StringFilter<"EmailEmbedding"> | string
    threadId?: StringFilter<"EmailEmbedding"> | string
    subjectSnippet?: StringFilter<"EmailEmbedding"> | string
    indexedAt?: DateTimeFilter<"EmailEmbedding"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_corsairEntityId">

  export type EmailEmbeddingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    subjectSnippet?: SortOrder
    indexedAt?: SortOrder
    _count?: EmailEmbeddingCountOrderByAggregateInput
    _max?: EmailEmbeddingMaxOrderByAggregateInput
    _min?: EmailEmbeddingMinOrderByAggregateInput
  }

  export type EmailEmbeddingScalarWhereWithAggregatesInput = {
    AND?: EmailEmbeddingScalarWhereWithAggregatesInput | EmailEmbeddingScalarWhereWithAggregatesInput[]
    OR?: EmailEmbeddingScalarWhereWithAggregatesInput[]
    NOT?: EmailEmbeddingScalarWhereWithAggregatesInput | EmailEmbeddingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailEmbedding"> | string
    userId?: StringWithAggregatesFilter<"EmailEmbedding"> | string
    corsairEntityId?: StringWithAggregatesFilter<"EmailEmbedding"> | string
    threadId?: StringWithAggregatesFilter<"EmailEmbedding"> | string
    subjectSnippet?: StringWithAggregatesFilter<"EmailEmbedding"> | string
    indexedAt?: DateTimeWithAggregatesFilter<"EmailEmbedding"> | Date | string
  }

  export type PriorityScoreWhereInput = {
    AND?: PriorityScoreWhereInput | PriorityScoreWhereInput[]
    OR?: PriorityScoreWhereInput[]
    NOT?: PriorityScoreWhereInput | PriorityScoreWhereInput[]
    id?: StringFilter<"PriorityScore"> | string
    userId?: StringFilter<"PriorityScore"> | string
    corsairEntityId?: StringFilter<"PriorityScore"> | string
    threadId?: StringFilter<"PriorityScore"> | string
    label?: StringFilter<"PriorityScore"> | string
    reason?: StringNullableFilter<"PriorityScore"> | string | null
    model?: StringNullableFilter<"PriorityScore"> | string | null
    createdAt?: DateTimeFilter<"PriorityScore"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PriorityScoreOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    label?: SortOrder
    reason?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PriorityScoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_threadId?: PriorityScoreUserIdThreadIdCompoundUniqueInput
    AND?: PriorityScoreWhereInput | PriorityScoreWhereInput[]
    OR?: PriorityScoreWhereInput[]
    NOT?: PriorityScoreWhereInput | PriorityScoreWhereInput[]
    userId?: StringFilter<"PriorityScore"> | string
    corsairEntityId?: StringFilter<"PriorityScore"> | string
    threadId?: StringFilter<"PriorityScore"> | string
    label?: StringFilter<"PriorityScore"> | string
    reason?: StringNullableFilter<"PriorityScore"> | string | null
    model?: StringNullableFilter<"PriorityScore"> | string | null
    createdAt?: DateTimeFilter<"PriorityScore"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_threadId">

  export type PriorityScoreOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    label?: SortOrder
    reason?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PriorityScoreCountOrderByAggregateInput
    _max?: PriorityScoreMaxOrderByAggregateInput
    _min?: PriorityScoreMinOrderByAggregateInput
  }

  export type PriorityScoreScalarWhereWithAggregatesInput = {
    AND?: PriorityScoreScalarWhereWithAggregatesInput | PriorityScoreScalarWhereWithAggregatesInput[]
    OR?: PriorityScoreScalarWhereWithAggregatesInput[]
    NOT?: PriorityScoreScalarWhereWithAggregatesInput | PriorityScoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PriorityScore"> | string
    userId?: StringWithAggregatesFilter<"PriorityScore"> | string
    corsairEntityId?: StringWithAggregatesFilter<"PriorityScore"> | string
    threadId?: StringWithAggregatesFilter<"PriorityScore"> | string
    label?: StringWithAggregatesFilter<"PriorityScore"> | string
    reason?: StringNullableWithAggregatesFilter<"PriorityScore"> | string | null
    model?: StringNullableWithAggregatesFilter<"PriorityScore"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PriorityScore"> | Date | string
  }

  export type PendingActionWhereInput = {
    AND?: PendingActionWhereInput | PendingActionWhereInput[]
    OR?: PendingActionWhereInput[]
    NOT?: PendingActionWhereInput | PendingActionWhereInput[]
    id?: StringFilter<"PendingAction"> | string
    userId?: StringFilter<"PendingAction"> | string
    channel?: StringFilter<"PendingAction"> | string
    kind?: StringFilter<"PendingAction"> | string
    draftPayload?: JsonFilter<"PendingAction">
    corsairOperationPath?: StringNullableFilter<"PendingAction"> | string | null
    status?: StringFilter<"PendingAction"> | string
    createdAt?: DateTimeFilter<"PendingAction"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"PendingAction"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PendingActionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    kind?: SortOrder
    draftPayload?: SortOrder
    corsairOperationPath?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PendingActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PendingActionWhereInput | PendingActionWhereInput[]
    OR?: PendingActionWhereInput[]
    NOT?: PendingActionWhereInput | PendingActionWhereInput[]
    userId?: StringFilter<"PendingAction"> | string
    channel?: StringFilter<"PendingAction"> | string
    kind?: StringFilter<"PendingAction"> | string
    draftPayload?: JsonFilter<"PendingAction">
    corsairOperationPath?: StringNullableFilter<"PendingAction"> | string | null
    status?: StringFilter<"PendingAction"> | string
    createdAt?: DateTimeFilter<"PendingAction"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"PendingAction"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PendingActionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    kind?: SortOrder
    draftPayload?: SortOrder
    corsairOperationPath?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    _count?: PendingActionCountOrderByAggregateInput
    _max?: PendingActionMaxOrderByAggregateInput
    _min?: PendingActionMinOrderByAggregateInput
  }

  export type PendingActionScalarWhereWithAggregatesInput = {
    AND?: PendingActionScalarWhereWithAggregatesInput | PendingActionScalarWhereWithAggregatesInput[]
    OR?: PendingActionScalarWhereWithAggregatesInput[]
    NOT?: PendingActionScalarWhereWithAggregatesInput | PendingActionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PendingAction"> | string
    userId?: StringWithAggregatesFilter<"PendingAction"> | string
    channel?: StringWithAggregatesFilter<"PendingAction"> | string
    kind?: StringWithAggregatesFilter<"PendingAction"> | string
    draftPayload?: JsonWithAggregatesFilter<"PendingAction">
    corsairOperationPath?: StringNullableWithAggregatesFilter<"PendingAction"> | string | null
    status?: StringWithAggregatesFilter<"PendingAction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PendingAction"> | Date | string
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"PendingAction"> | Date | string | null
  }

  export type UserPreferenceWhereInput = {
    AND?: UserPreferenceWhereInput | UserPreferenceWhereInput[]
    OR?: UserPreferenceWhereInput[]
    NOT?: UserPreferenceWhereInput | UserPreferenceWhereInput[]
    id?: StringFilter<"UserPreference"> | string
    userId?: StringFilter<"UserPreference"> | string
    splitInboxRules?: JsonFilter<"UserPreference">
    shortcutOverrides?: JsonFilter<"UserPreference">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserPreferenceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    splitInboxRules?: SortOrder
    shortcutOverrides?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserPreferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserPreferenceWhereInput | UserPreferenceWhereInput[]
    OR?: UserPreferenceWhereInput[]
    NOT?: UserPreferenceWhereInput | UserPreferenceWhereInput[]
    splitInboxRules?: JsonFilter<"UserPreference">
    shortcutOverrides?: JsonFilter<"UserPreference">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserPreferenceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    splitInboxRules?: SortOrder
    shortcutOverrides?: SortOrder
    _count?: UserPreferenceCountOrderByAggregateInput
    _max?: UserPreferenceMaxOrderByAggregateInput
    _min?: UserPreferenceMinOrderByAggregateInput
  }

  export type UserPreferenceScalarWhereWithAggregatesInput = {
    AND?: UserPreferenceScalarWhereWithAggregatesInput | UserPreferenceScalarWhereWithAggregatesInput[]
    OR?: UserPreferenceScalarWhereWithAggregatesInput[]
    NOT?: UserPreferenceScalarWhereWithAggregatesInput | UserPreferenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserPreference"> | string
    userId?: StringWithAggregatesFilter<"UserPreference"> | string
    splitInboxRules?: JsonWithAggregatesFilter<"UserPreference">
    shortcutOverrides?: JsonWithAggregatesFilter<"UserPreference">
  }

  export type SyncItemWhereInput = {
    AND?: SyncItemWhereInput | SyncItemWhereInput[]
    OR?: SyncItemWhereInput[]
    NOT?: SyncItemWhereInput | SyncItemWhereInput[]
    id?: StringFilter<"SyncItem"> | string
    userId?: StringFilter<"SyncItem"> | string
    corsairEntityId?: StringFilter<"SyncItem"> | string
    type?: StringFilter<"SyncItem"> | string
    title?: StringFilter<"SyncItem"> | string
    snippet?: StringFilter<"SyncItem"> | string
    timestamp?: DateTimeFilter<"SyncItem"> | Date | string
    createdAt?: DateTimeFilter<"SyncItem"> | Date | string
    updatedAt?: DateTimeFilter<"SyncItem"> | Date | string
  }

  export type SyncItemOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    snippet?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_corsairEntityId?: SyncItemUserIdCorsairEntityIdCompoundUniqueInput
    AND?: SyncItemWhereInput | SyncItemWhereInput[]
    OR?: SyncItemWhereInput[]
    NOT?: SyncItemWhereInput | SyncItemWhereInput[]
    userId?: StringFilter<"SyncItem"> | string
    corsairEntityId?: StringFilter<"SyncItem"> | string
    type?: StringFilter<"SyncItem"> | string
    title?: StringFilter<"SyncItem"> | string
    snippet?: StringFilter<"SyncItem"> | string
    timestamp?: DateTimeFilter<"SyncItem"> | Date | string
    createdAt?: DateTimeFilter<"SyncItem"> | Date | string
    updatedAt?: DateTimeFilter<"SyncItem"> | Date | string
  }, "id" | "userId_corsairEntityId">

  export type SyncItemOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    snippet?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncItemCountOrderByAggregateInput
    _max?: SyncItemMaxOrderByAggregateInput
    _min?: SyncItemMinOrderByAggregateInput
  }

  export type SyncItemScalarWhereWithAggregatesInput = {
    AND?: SyncItemScalarWhereWithAggregatesInput | SyncItemScalarWhereWithAggregatesInput[]
    OR?: SyncItemScalarWhereWithAggregatesInput[]
    NOT?: SyncItemScalarWhereWithAggregatesInput | SyncItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncItem"> | string
    userId?: StringWithAggregatesFilter<"SyncItem"> | string
    corsairEntityId?: StringWithAggregatesFilter<"SyncItem"> | string
    type?: StringWithAggregatesFilter<"SyncItem"> | string
    title?: StringWithAggregatesFilter<"SyncItem"> | string
    snippet?: StringWithAggregatesFilter<"SyncItem"> | string
    timestamp?: DateTimeWithAggregatesFilter<"SyncItem"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SyncItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncItem"> | Date | string
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

  export type UserCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionCreateNestedManyWithoutUserInput
    preference?: UserPreferenceCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkUncheckedCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingUncheckedCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreUncheckedCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionUncheckedCreateNestedManyWithoutUserInput
    preference?: UserPreferenceUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUncheckedUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUncheckedUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUncheckedUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUncheckedUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChannelLinkCreateInput = {
    id?: string
    channel: string
    externalChatId: string
    linkedAt?: Date | string
    user: UserCreateNestedOneWithoutChannelLinksInput
  }

  export type ChannelLinkUncheckedCreateInput = {
    id?: string
    userId: string
    channel: string
    externalChatId: string
    linkedAt?: Date | string
  }

  export type ChannelLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChannelLinksNestedInput
  }

  export type ChannelLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChannelLinkCreateManyInput = {
    id?: string
    userId: string
    channel: string
    externalChatId: string
    linkedAt?: Date | string
  }

  export type ChannelLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChannelLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailEmbeddingCreateInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt?: Date | string
    user: UserCreateNestedOneWithoutEmailEmbeddingsInput
  }

  export type EmailEmbeddingUncheckedCreateInput = {
    id?: string
    userId: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt?: Date | string
  }

  export type EmailEmbeddingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutEmailEmbeddingsNestedInput
  }

  export type EmailEmbeddingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailEmbeddingCreateManyInput = {
    id?: string
    userId: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt?: Date | string
  }

  export type EmailEmbeddingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailEmbeddingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorityScoreCreateInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    label: string
    reason?: string | null
    model?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPriorityScoresInput
  }

  export type PriorityScoreUncheckedCreateInput = {
    id?: string
    userId: string
    corsairEntityId: string
    threadId: string
    label: string
    reason?: string | null
    model?: string | null
    createdAt?: Date | string
  }

  export type PriorityScoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPriorityScoresNestedInput
  }

  export type PriorityScoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorityScoreCreateManyInput = {
    id?: string
    userId: string
    corsairEntityId: string
    threadId: string
    label: string
    reason?: string | null
    model?: string | null
    createdAt?: Date | string
  }

  export type PriorityScoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorityScoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingActionCreateInput = {
    id?: string
    channel: string
    kind: string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: string | null
    status?: string
    createdAt?: Date | string
    resolvedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPendingActionsInput
  }

  export type PendingActionUncheckedCreateInput = {
    id?: string
    userId: string
    channel: string
    kind: string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: string | null
    status?: string
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type PendingActionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPendingActionsNestedInput
  }

  export type PendingActionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PendingActionCreateManyInput = {
    id?: string
    userId: string
    channel: string
    kind: string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: string | null
    status?: string
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type PendingActionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PendingActionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserPreferenceCreateInput = {
    id?: string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutPreferenceInput
  }

  export type UserPreferenceUncheckedCreateInput = {
    id?: string
    userId: string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutPreferenceNestedInput
  }

  export type UserPreferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceCreateManyInput = {
    id?: string
    userId: string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type SyncItemCreateInput = {
    id?: string
    userId: string
    corsairEntityId: string
    type: string
    title: string
    snippet: string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncItemUncheckedCreateInput = {
    id?: string
    userId: string
    corsairEntityId: string
    type: string
    title: string
    snippet: string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    snippet?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    snippet?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncItemCreateManyInput = {
    id?: string
    userId: string
    corsairEntityId: string
    type: string
    title: string
    snippet: string
    timestamp: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    snippet?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    snippet?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ChannelLinkListRelationFilter = {
    every?: ChannelLinkWhereInput
    some?: ChannelLinkWhereInput
    none?: ChannelLinkWhereInput
  }

  export type EmailEmbeddingListRelationFilter = {
    every?: EmailEmbeddingWhereInput
    some?: EmailEmbeddingWhereInput
    none?: EmailEmbeddingWhereInput
  }

  export type PriorityScoreListRelationFilter = {
    every?: PriorityScoreWhereInput
    some?: PriorityScoreWhereInput
    none?: PriorityScoreWhereInput
  }

  export type PendingActionListRelationFilter = {
    every?: PendingActionWhereInput
    some?: PendingActionWhereInput
    none?: PendingActionWhereInput
  }

  export type UserPreferenceNullableScalarRelationFilter = {
    is?: UserPreferenceWhereInput | null
    isNot?: UserPreferenceWhereInput | null
  }

  export type ChannelLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmailEmbeddingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PriorityScoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PendingActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gmailBackfilledAt?: SortOrder
    calendarBackfilledAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gmailBackfilledAt?: SortOrder
    calendarBackfilledAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gmailBackfilledAt?: SortOrder
    calendarBackfilledAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ChannelLinkChannelExternalChatIdCompoundUniqueInput = {
    channel: string
    externalChatId: string
  }

  export type ChannelLinkCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    externalChatId?: SortOrder
    linkedAt?: SortOrder
  }

  export type ChannelLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    externalChatId?: SortOrder
    linkedAt?: SortOrder
  }

  export type ChannelLinkMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    externalChatId?: SortOrder
    linkedAt?: SortOrder
  }

  export type EmailEmbeddingUserIdCorsairEntityIdCompoundUniqueInput = {
    userId: string
    corsairEntityId: string
  }

  export type EmailEmbeddingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    subjectSnippet?: SortOrder
    indexedAt?: SortOrder
  }

  export type EmailEmbeddingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    subjectSnippet?: SortOrder
    indexedAt?: SortOrder
  }

  export type EmailEmbeddingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    subjectSnippet?: SortOrder
    indexedAt?: SortOrder
  }

  export type PriorityScoreUserIdThreadIdCompoundUniqueInput = {
    userId: string
    threadId: string
  }

  export type PriorityScoreCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    label?: SortOrder
    reason?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type PriorityScoreMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    label?: SortOrder
    reason?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type PriorityScoreMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    threadId?: SortOrder
    label?: SortOrder
    reason?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingActionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    kind?: SortOrder
    draftPayload?: SortOrder
    corsairOperationPath?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type PendingActionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    kind?: SortOrder
    corsairOperationPath?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type PendingActionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    channel?: SortOrder
    kind?: SortOrder
    corsairOperationPath?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type UserPreferenceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    splitInboxRules?: SortOrder
    shortcutOverrides?: SortOrder
  }

  export type UserPreferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type UserPreferenceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type SyncItemUserIdCorsairEntityIdCompoundUniqueInput = {
    userId: string
    corsairEntityId: string
  }

  export type SyncItemCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    snippet?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncItemMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    snippet?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncItemMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    corsairEntityId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    snippet?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type ChannelLinkCreateNestedManyWithoutUserInput = {
    create?: XOR<ChannelLinkCreateWithoutUserInput, ChannelLinkUncheckedCreateWithoutUserInput> | ChannelLinkCreateWithoutUserInput[] | ChannelLinkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChannelLinkCreateOrConnectWithoutUserInput | ChannelLinkCreateOrConnectWithoutUserInput[]
    createMany?: ChannelLinkCreateManyUserInputEnvelope
    connect?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
  }

  export type EmailEmbeddingCreateNestedManyWithoutUserInput = {
    create?: XOR<EmailEmbeddingCreateWithoutUserInput, EmailEmbeddingUncheckedCreateWithoutUserInput> | EmailEmbeddingCreateWithoutUserInput[] | EmailEmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailEmbeddingCreateOrConnectWithoutUserInput | EmailEmbeddingCreateOrConnectWithoutUserInput[]
    createMany?: EmailEmbeddingCreateManyUserInputEnvelope
    connect?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
  }

  export type PriorityScoreCreateNestedManyWithoutUserInput = {
    create?: XOR<PriorityScoreCreateWithoutUserInput, PriorityScoreUncheckedCreateWithoutUserInput> | PriorityScoreCreateWithoutUserInput[] | PriorityScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PriorityScoreCreateOrConnectWithoutUserInput | PriorityScoreCreateOrConnectWithoutUserInput[]
    createMany?: PriorityScoreCreateManyUserInputEnvelope
    connect?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
  }

  export type PendingActionCreateNestedManyWithoutUserInput = {
    create?: XOR<PendingActionCreateWithoutUserInput, PendingActionUncheckedCreateWithoutUserInput> | PendingActionCreateWithoutUserInput[] | PendingActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PendingActionCreateOrConnectWithoutUserInput | PendingActionCreateOrConnectWithoutUserInput[]
    createMany?: PendingActionCreateManyUserInputEnvelope
    connect?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
  }

  export type UserPreferenceCreateNestedOneWithoutUserInput = {
    create?: XOR<UserPreferenceCreateWithoutUserInput, UserPreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPreferenceCreateOrConnectWithoutUserInput
    connect?: UserPreferenceWhereUniqueInput
  }

  export type ChannelLinkUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChannelLinkCreateWithoutUserInput, ChannelLinkUncheckedCreateWithoutUserInput> | ChannelLinkCreateWithoutUserInput[] | ChannelLinkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChannelLinkCreateOrConnectWithoutUserInput | ChannelLinkCreateOrConnectWithoutUserInput[]
    createMany?: ChannelLinkCreateManyUserInputEnvelope
    connect?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
  }

  export type EmailEmbeddingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EmailEmbeddingCreateWithoutUserInput, EmailEmbeddingUncheckedCreateWithoutUserInput> | EmailEmbeddingCreateWithoutUserInput[] | EmailEmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailEmbeddingCreateOrConnectWithoutUserInput | EmailEmbeddingCreateOrConnectWithoutUserInput[]
    createMany?: EmailEmbeddingCreateManyUserInputEnvelope
    connect?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
  }

  export type PriorityScoreUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PriorityScoreCreateWithoutUserInput, PriorityScoreUncheckedCreateWithoutUserInput> | PriorityScoreCreateWithoutUserInput[] | PriorityScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PriorityScoreCreateOrConnectWithoutUserInput | PriorityScoreCreateOrConnectWithoutUserInput[]
    createMany?: PriorityScoreCreateManyUserInputEnvelope
    connect?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
  }

  export type PendingActionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PendingActionCreateWithoutUserInput, PendingActionUncheckedCreateWithoutUserInput> | PendingActionCreateWithoutUserInput[] | PendingActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PendingActionCreateOrConnectWithoutUserInput | PendingActionCreateOrConnectWithoutUserInput[]
    createMany?: PendingActionCreateManyUserInputEnvelope
    connect?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
  }

  export type UserPreferenceUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserPreferenceCreateWithoutUserInput, UserPreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPreferenceCreateOrConnectWithoutUserInput
    connect?: UserPreferenceWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ChannelLinkUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChannelLinkCreateWithoutUserInput, ChannelLinkUncheckedCreateWithoutUserInput> | ChannelLinkCreateWithoutUserInput[] | ChannelLinkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChannelLinkCreateOrConnectWithoutUserInput | ChannelLinkCreateOrConnectWithoutUserInput[]
    upsert?: ChannelLinkUpsertWithWhereUniqueWithoutUserInput | ChannelLinkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChannelLinkCreateManyUserInputEnvelope
    set?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    disconnect?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    delete?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    connect?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    update?: ChannelLinkUpdateWithWhereUniqueWithoutUserInput | ChannelLinkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChannelLinkUpdateManyWithWhereWithoutUserInput | ChannelLinkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChannelLinkScalarWhereInput | ChannelLinkScalarWhereInput[]
  }

  export type EmailEmbeddingUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmailEmbeddingCreateWithoutUserInput, EmailEmbeddingUncheckedCreateWithoutUserInput> | EmailEmbeddingCreateWithoutUserInput[] | EmailEmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailEmbeddingCreateOrConnectWithoutUserInput | EmailEmbeddingCreateOrConnectWithoutUserInput[]
    upsert?: EmailEmbeddingUpsertWithWhereUniqueWithoutUserInput | EmailEmbeddingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmailEmbeddingCreateManyUserInputEnvelope
    set?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    disconnect?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    delete?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    connect?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    update?: EmailEmbeddingUpdateWithWhereUniqueWithoutUserInput | EmailEmbeddingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmailEmbeddingUpdateManyWithWhereWithoutUserInput | EmailEmbeddingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmailEmbeddingScalarWhereInput | EmailEmbeddingScalarWhereInput[]
  }

  export type PriorityScoreUpdateManyWithoutUserNestedInput = {
    create?: XOR<PriorityScoreCreateWithoutUserInput, PriorityScoreUncheckedCreateWithoutUserInput> | PriorityScoreCreateWithoutUserInput[] | PriorityScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PriorityScoreCreateOrConnectWithoutUserInput | PriorityScoreCreateOrConnectWithoutUserInput[]
    upsert?: PriorityScoreUpsertWithWhereUniqueWithoutUserInput | PriorityScoreUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PriorityScoreCreateManyUserInputEnvelope
    set?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    disconnect?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    delete?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    connect?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    update?: PriorityScoreUpdateWithWhereUniqueWithoutUserInput | PriorityScoreUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PriorityScoreUpdateManyWithWhereWithoutUserInput | PriorityScoreUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PriorityScoreScalarWhereInput | PriorityScoreScalarWhereInput[]
  }

  export type PendingActionUpdateManyWithoutUserNestedInput = {
    create?: XOR<PendingActionCreateWithoutUserInput, PendingActionUncheckedCreateWithoutUserInput> | PendingActionCreateWithoutUserInput[] | PendingActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PendingActionCreateOrConnectWithoutUserInput | PendingActionCreateOrConnectWithoutUserInput[]
    upsert?: PendingActionUpsertWithWhereUniqueWithoutUserInput | PendingActionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PendingActionCreateManyUserInputEnvelope
    set?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    disconnect?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    delete?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    connect?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    update?: PendingActionUpdateWithWhereUniqueWithoutUserInput | PendingActionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PendingActionUpdateManyWithWhereWithoutUserInput | PendingActionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PendingActionScalarWhereInput | PendingActionScalarWhereInput[]
  }

  export type UserPreferenceUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserPreferenceCreateWithoutUserInput, UserPreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPreferenceCreateOrConnectWithoutUserInput
    upsert?: UserPreferenceUpsertWithoutUserInput
    disconnect?: UserPreferenceWhereInput | boolean
    delete?: UserPreferenceWhereInput | boolean
    connect?: UserPreferenceWhereUniqueInput
    update?: XOR<XOR<UserPreferenceUpdateToOneWithWhereWithoutUserInput, UserPreferenceUpdateWithoutUserInput>, UserPreferenceUncheckedUpdateWithoutUserInput>
  }

  export type ChannelLinkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChannelLinkCreateWithoutUserInput, ChannelLinkUncheckedCreateWithoutUserInput> | ChannelLinkCreateWithoutUserInput[] | ChannelLinkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChannelLinkCreateOrConnectWithoutUserInput | ChannelLinkCreateOrConnectWithoutUserInput[]
    upsert?: ChannelLinkUpsertWithWhereUniqueWithoutUserInput | ChannelLinkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChannelLinkCreateManyUserInputEnvelope
    set?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    disconnect?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    delete?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    connect?: ChannelLinkWhereUniqueInput | ChannelLinkWhereUniqueInput[]
    update?: ChannelLinkUpdateWithWhereUniqueWithoutUserInput | ChannelLinkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChannelLinkUpdateManyWithWhereWithoutUserInput | ChannelLinkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChannelLinkScalarWhereInput | ChannelLinkScalarWhereInput[]
  }

  export type EmailEmbeddingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmailEmbeddingCreateWithoutUserInput, EmailEmbeddingUncheckedCreateWithoutUserInput> | EmailEmbeddingCreateWithoutUserInput[] | EmailEmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailEmbeddingCreateOrConnectWithoutUserInput | EmailEmbeddingCreateOrConnectWithoutUserInput[]
    upsert?: EmailEmbeddingUpsertWithWhereUniqueWithoutUserInput | EmailEmbeddingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmailEmbeddingCreateManyUserInputEnvelope
    set?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    disconnect?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    delete?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    connect?: EmailEmbeddingWhereUniqueInput | EmailEmbeddingWhereUniqueInput[]
    update?: EmailEmbeddingUpdateWithWhereUniqueWithoutUserInput | EmailEmbeddingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmailEmbeddingUpdateManyWithWhereWithoutUserInput | EmailEmbeddingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmailEmbeddingScalarWhereInput | EmailEmbeddingScalarWhereInput[]
  }

  export type PriorityScoreUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PriorityScoreCreateWithoutUserInput, PriorityScoreUncheckedCreateWithoutUserInput> | PriorityScoreCreateWithoutUserInput[] | PriorityScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PriorityScoreCreateOrConnectWithoutUserInput | PriorityScoreCreateOrConnectWithoutUserInput[]
    upsert?: PriorityScoreUpsertWithWhereUniqueWithoutUserInput | PriorityScoreUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PriorityScoreCreateManyUserInputEnvelope
    set?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    disconnect?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    delete?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    connect?: PriorityScoreWhereUniqueInput | PriorityScoreWhereUniqueInput[]
    update?: PriorityScoreUpdateWithWhereUniqueWithoutUserInput | PriorityScoreUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PriorityScoreUpdateManyWithWhereWithoutUserInput | PriorityScoreUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PriorityScoreScalarWhereInput | PriorityScoreScalarWhereInput[]
  }

  export type PendingActionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PendingActionCreateWithoutUserInput, PendingActionUncheckedCreateWithoutUserInput> | PendingActionCreateWithoutUserInput[] | PendingActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PendingActionCreateOrConnectWithoutUserInput | PendingActionCreateOrConnectWithoutUserInput[]
    upsert?: PendingActionUpsertWithWhereUniqueWithoutUserInput | PendingActionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PendingActionCreateManyUserInputEnvelope
    set?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    disconnect?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    delete?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    connect?: PendingActionWhereUniqueInput | PendingActionWhereUniqueInput[]
    update?: PendingActionUpdateWithWhereUniqueWithoutUserInput | PendingActionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PendingActionUpdateManyWithWhereWithoutUserInput | PendingActionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PendingActionScalarWhereInput | PendingActionScalarWhereInput[]
  }

  export type UserPreferenceUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserPreferenceCreateWithoutUserInput, UserPreferenceUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPreferenceCreateOrConnectWithoutUserInput
    upsert?: UserPreferenceUpsertWithoutUserInput
    disconnect?: UserPreferenceWhereInput | boolean
    delete?: UserPreferenceWhereInput | boolean
    connect?: UserPreferenceWhereUniqueInput
    update?: XOR<XOR<UserPreferenceUpdateToOneWithWhereWithoutUserInput, UserPreferenceUpdateWithoutUserInput>, UserPreferenceUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutChannelLinksInput = {
    create?: XOR<UserCreateWithoutChannelLinksInput, UserUncheckedCreateWithoutChannelLinksInput>
    connectOrCreate?: UserCreateOrConnectWithoutChannelLinksInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutChannelLinksNestedInput = {
    create?: XOR<UserCreateWithoutChannelLinksInput, UserUncheckedCreateWithoutChannelLinksInput>
    connectOrCreate?: UserCreateOrConnectWithoutChannelLinksInput
    upsert?: UserUpsertWithoutChannelLinksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChannelLinksInput, UserUpdateWithoutChannelLinksInput>, UserUncheckedUpdateWithoutChannelLinksInput>
  }

  export type UserCreateNestedOneWithoutEmailEmbeddingsInput = {
    create?: XOR<UserCreateWithoutEmailEmbeddingsInput, UserUncheckedCreateWithoutEmailEmbeddingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmailEmbeddingsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutEmailEmbeddingsNestedInput = {
    create?: XOR<UserCreateWithoutEmailEmbeddingsInput, UserUncheckedCreateWithoutEmailEmbeddingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmailEmbeddingsInput
    upsert?: UserUpsertWithoutEmailEmbeddingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEmailEmbeddingsInput, UserUpdateWithoutEmailEmbeddingsInput>, UserUncheckedUpdateWithoutEmailEmbeddingsInput>
  }

  export type UserCreateNestedOneWithoutPriorityScoresInput = {
    create?: XOR<UserCreateWithoutPriorityScoresInput, UserUncheckedCreateWithoutPriorityScoresInput>
    connectOrCreate?: UserCreateOrConnectWithoutPriorityScoresInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPriorityScoresNestedInput = {
    create?: XOR<UserCreateWithoutPriorityScoresInput, UserUncheckedCreateWithoutPriorityScoresInput>
    connectOrCreate?: UserCreateOrConnectWithoutPriorityScoresInput
    upsert?: UserUpsertWithoutPriorityScoresInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPriorityScoresInput, UserUpdateWithoutPriorityScoresInput>, UserUncheckedUpdateWithoutPriorityScoresInput>
  }

  export type UserCreateNestedOneWithoutPendingActionsInput = {
    create?: XOR<UserCreateWithoutPendingActionsInput, UserUncheckedCreateWithoutPendingActionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPendingActionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPendingActionsNestedInput = {
    create?: XOR<UserCreateWithoutPendingActionsInput, UserUncheckedCreateWithoutPendingActionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPendingActionsInput
    upsert?: UserUpsertWithoutPendingActionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPendingActionsInput, UserUpdateWithoutPendingActionsInput>, UserUncheckedUpdateWithoutPendingActionsInput>
  }

  export type UserCreateNestedOneWithoutPreferenceInput = {
    create?: XOR<UserCreateWithoutPreferenceInput, UserUncheckedCreateWithoutPreferenceInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreferenceInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPreferenceNestedInput = {
    create?: XOR<UserCreateWithoutPreferenceInput, UserUncheckedCreateWithoutPreferenceInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreferenceInput
    upsert?: UserUpsertWithoutPreferenceInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPreferenceInput, UserUpdateWithoutPreferenceInput>, UserUncheckedUpdateWithoutPreferenceInput>
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

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type ChannelLinkCreateWithoutUserInput = {
    id?: string
    channel: string
    externalChatId: string
    linkedAt?: Date | string
  }

  export type ChannelLinkUncheckedCreateWithoutUserInput = {
    id?: string
    channel: string
    externalChatId: string
    linkedAt?: Date | string
  }

  export type ChannelLinkCreateOrConnectWithoutUserInput = {
    where: ChannelLinkWhereUniqueInput
    create: XOR<ChannelLinkCreateWithoutUserInput, ChannelLinkUncheckedCreateWithoutUserInput>
  }

  export type ChannelLinkCreateManyUserInputEnvelope = {
    data: ChannelLinkCreateManyUserInput | ChannelLinkCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EmailEmbeddingCreateWithoutUserInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt?: Date | string
  }

  export type EmailEmbeddingUncheckedCreateWithoutUserInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt?: Date | string
  }

  export type EmailEmbeddingCreateOrConnectWithoutUserInput = {
    where: EmailEmbeddingWhereUniqueInput
    create: XOR<EmailEmbeddingCreateWithoutUserInput, EmailEmbeddingUncheckedCreateWithoutUserInput>
  }

  export type EmailEmbeddingCreateManyUserInputEnvelope = {
    data: EmailEmbeddingCreateManyUserInput | EmailEmbeddingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PriorityScoreCreateWithoutUserInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    label: string
    reason?: string | null
    model?: string | null
    createdAt?: Date | string
  }

  export type PriorityScoreUncheckedCreateWithoutUserInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    label: string
    reason?: string | null
    model?: string | null
    createdAt?: Date | string
  }

  export type PriorityScoreCreateOrConnectWithoutUserInput = {
    where: PriorityScoreWhereUniqueInput
    create: XOR<PriorityScoreCreateWithoutUserInput, PriorityScoreUncheckedCreateWithoutUserInput>
  }

  export type PriorityScoreCreateManyUserInputEnvelope = {
    data: PriorityScoreCreateManyUserInput | PriorityScoreCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PendingActionCreateWithoutUserInput = {
    id?: string
    channel: string
    kind: string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: string | null
    status?: string
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type PendingActionUncheckedCreateWithoutUserInput = {
    id?: string
    channel: string
    kind: string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: string | null
    status?: string
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type PendingActionCreateOrConnectWithoutUserInput = {
    where: PendingActionWhereUniqueInput
    create: XOR<PendingActionCreateWithoutUserInput, PendingActionUncheckedCreateWithoutUserInput>
  }

  export type PendingActionCreateManyUserInputEnvelope = {
    data: PendingActionCreateManyUserInput | PendingActionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPreferenceCreateWithoutUserInput = {
    id?: string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceUncheckedCreateWithoutUserInput = {
    id?: string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceCreateOrConnectWithoutUserInput = {
    where: UserPreferenceWhereUniqueInput
    create: XOR<UserPreferenceCreateWithoutUserInput, UserPreferenceUncheckedCreateWithoutUserInput>
  }

  export type ChannelLinkUpsertWithWhereUniqueWithoutUserInput = {
    where: ChannelLinkWhereUniqueInput
    update: XOR<ChannelLinkUpdateWithoutUserInput, ChannelLinkUncheckedUpdateWithoutUserInput>
    create: XOR<ChannelLinkCreateWithoutUserInput, ChannelLinkUncheckedCreateWithoutUserInput>
  }

  export type ChannelLinkUpdateWithWhereUniqueWithoutUserInput = {
    where: ChannelLinkWhereUniqueInput
    data: XOR<ChannelLinkUpdateWithoutUserInput, ChannelLinkUncheckedUpdateWithoutUserInput>
  }

  export type ChannelLinkUpdateManyWithWhereWithoutUserInput = {
    where: ChannelLinkScalarWhereInput
    data: XOR<ChannelLinkUpdateManyMutationInput, ChannelLinkUncheckedUpdateManyWithoutUserInput>
  }

  export type ChannelLinkScalarWhereInput = {
    AND?: ChannelLinkScalarWhereInput | ChannelLinkScalarWhereInput[]
    OR?: ChannelLinkScalarWhereInput[]
    NOT?: ChannelLinkScalarWhereInput | ChannelLinkScalarWhereInput[]
    id?: StringFilter<"ChannelLink"> | string
    userId?: StringFilter<"ChannelLink"> | string
    channel?: StringFilter<"ChannelLink"> | string
    externalChatId?: StringFilter<"ChannelLink"> | string
    linkedAt?: DateTimeFilter<"ChannelLink"> | Date | string
  }

  export type EmailEmbeddingUpsertWithWhereUniqueWithoutUserInput = {
    where: EmailEmbeddingWhereUniqueInput
    update: XOR<EmailEmbeddingUpdateWithoutUserInput, EmailEmbeddingUncheckedUpdateWithoutUserInput>
    create: XOR<EmailEmbeddingCreateWithoutUserInput, EmailEmbeddingUncheckedCreateWithoutUserInput>
  }

  export type EmailEmbeddingUpdateWithWhereUniqueWithoutUserInput = {
    where: EmailEmbeddingWhereUniqueInput
    data: XOR<EmailEmbeddingUpdateWithoutUserInput, EmailEmbeddingUncheckedUpdateWithoutUserInput>
  }

  export type EmailEmbeddingUpdateManyWithWhereWithoutUserInput = {
    where: EmailEmbeddingScalarWhereInput
    data: XOR<EmailEmbeddingUpdateManyMutationInput, EmailEmbeddingUncheckedUpdateManyWithoutUserInput>
  }

  export type EmailEmbeddingScalarWhereInput = {
    AND?: EmailEmbeddingScalarWhereInput | EmailEmbeddingScalarWhereInput[]
    OR?: EmailEmbeddingScalarWhereInput[]
    NOT?: EmailEmbeddingScalarWhereInput | EmailEmbeddingScalarWhereInput[]
    id?: StringFilter<"EmailEmbedding"> | string
    userId?: StringFilter<"EmailEmbedding"> | string
    corsairEntityId?: StringFilter<"EmailEmbedding"> | string
    threadId?: StringFilter<"EmailEmbedding"> | string
    subjectSnippet?: StringFilter<"EmailEmbedding"> | string
    indexedAt?: DateTimeFilter<"EmailEmbedding"> | Date | string
  }

  export type PriorityScoreUpsertWithWhereUniqueWithoutUserInput = {
    where: PriorityScoreWhereUniqueInput
    update: XOR<PriorityScoreUpdateWithoutUserInput, PriorityScoreUncheckedUpdateWithoutUserInput>
    create: XOR<PriorityScoreCreateWithoutUserInput, PriorityScoreUncheckedCreateWithoutUserInput>
  }

  export type PriorityScoreUpdateWithWhereUniqueWithoutUserInput = {
    where: PriorityScoreWhereUniqueInput
    data: XOR<PriorityScoreUpdateWithoutUserInput, PriorityScoreUncheckedUpdateWithoutUserInput>
  }

  export type PriorityScoreUpdateManyWithWhereWithoutUserInput = {
    where: PriorityScoreScalarWhereInput
    data: XOR<PriorityScoreUpdateManyMutationInput, PriorityScoreUncheckedUpdateManyWithoutUserInput>
  }

  export type PriorityScoreScalarWhereInput = {
    AND?: PriorityScoreScalarWhereInput | PriorityScoreScalarWhereInput[]
    OR?: PriorityScoreScalarWhereInput[]
    NOT?: PriorityScoreScalarWhereInput | PriorityScoreScalarWhereInput[]
    id?: StringFilter<"PriorityScore"> | string
    userId?: StringFilter<"PriorityScore"> | string
    corsairEntityId?: StringFilter<"PriorityScore"> | string
    threadId?: StringFilter<"PriorityScore"> | string
    label?: StringFilter<"PriorityScore"> | string
    reason?: StringNullableFilter<"PriorityScore"> | string | null
    model?: StringNullableFilter<"PriorityScore"> | string | null
    createdAt?: DateTimeFilter<"PriorityScore"> | Date | string
  }

  export type PendingActionUpsertWithWhereUniqueWithoutUserInput = {
    where: PendingActionWhereUniqueInput
    update: XOR<PendingActionUpdateWithoutUserInput, PendingActionUncheckedUpdateWithoutUserInput>
    create: XOR<PendingActionCreateWithoutUserInput, PendingActionUncheckedCreateWithoutUserInput>
  }

  export type PendingActionUpdateWithWhereUniqueWithoutUserInput = {
    where: PendingActionWhereUniqueInput
    data: XOR<PendingActionUpdateWithoutUserInput, PendingActionUncheckedUpdateWithoutUserInput>
  }

  export type PendingActionUpdateManyWithWhereWithoutUserInput = {
    where: PendingActionScalarWhereInput
    data: XOR<PendingActionUpdateManyMutationInput, PendingActionUncheckedUpdateManyWithoutUserInput>
  }

  export type PendingActionScalarWhereInput = {
    AND?: PendingActionScalarWhereInput | PendingActionScalarWhereInput[]
    OR?: PendingActionScalarWhereInput[]
    NOT?: PendingActionScalarWhereInput | PendingActionScalarWhereInput[]
    id?: StringFilter<"PendingAction"> | string
    userId?: StringFilter<"PendingAction"> | string
    channel?: StringFilter<"PendingAction"> | string
    kind?: StringFilter<"PendingAction"> | string
    draftPayload?: JsonFilter<"PendingAction">
    corsairOperationPath?: StringNullableFilter<"PendingAction"> | string | null
    status?: StringFilter<"PendingAction"> | string
    createdAt?: DateTimeFilter<"PendingAction"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"PendingAction"> | Date | string | null
  }

  export type UserPreferenceUpsertWithoutUserInput = {
    update: XOR<UserPreferenceUpdateWithoutUserInput, UserPreferenceUncheckedUpdateWithoutUserInput>
    create: XOR<UserPreferenceCreateWithoutUserInput, UserPreferenceUncheckedCreateWithoutUserInput>
    where?: UserPreferenceWhereInput
  }

  export type UserPreferenceUpdateToOneWithWhereWithoutUserInput = {
    where?: UserPreferenceWhereInput
    data: XOR<UserPreferenceUpdateWithoutUserInput, UserPreferenceUncheckedUpdateWithoutUserInput>
  }

  export type UserPreferenceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserPreferenceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    splitInboxRules?: JsonNullValueInput | InputJsonValue
    shortcutOverrides?: JsonNullValueInput | InputJsonValue
  }

  export type UserCreateWithoutChannelLinksInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    emailEmbeddings?: EmailEmbeddingCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionCreateNestedManyWithoutUserInput
    preference?: UserPreferenceCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChannelLinksInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    emailEmbeddings?: EmailEmbeddingUncheckedCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreUncheckedCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionUncheckedCreateNestedManyWithoutUserInput
    preference?: UserPreferenceUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChannelLinksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChannelLinksInput, UserUncheckedCreateWithoutChannelLinksInput>
  }

  export type UserUpsertWithoutChannelLinksInput = {
    update: XOR<UserUpdateWithoutChannelLinksInput, UserUncheckedUpdateWithoutChannelLinksInput>
    create: XOR<UserCreateWithoutChannelLinksInput, UserUncheckedCreateWithoutChannelLinksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChannelLinksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChannelLinksInput, UserUncheckedUpdateWithoutChannelLinksInput>
  }

  export type UserUpdateWithoutChannelLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailEmbeddings?: EmailEmbeddingUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChannelLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailEmbeddings?: EmailEmbeddingUncheckedUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUncheckedUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUncheckedUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutEmailEmbeddingsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionCreateNestedManyWithoutUserInput
    preference?: UserPreferenceCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEmailEmbeddingsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkUncheckedCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreUncheckedCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionUncheckedCreateNestedManyWithoutUserInput
    preference?: UserPreferenceUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEmailEmbeddingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEmailEmbeddingsInput, UserUncheckedCreateWithoutEmailEmbeddingsInput>
  }

  export type UserUpsertWithoutEmailEmbeddingsInput = {
    update: XOR<UserUpdateWithoutEmailEmbeddingsInput, UserUncheckedUpdateWithoutEmailEmbeddingsInput>
    create: XOR<UserCreateWithoutEmailEmbeddingsInput, UserUncheckedCreateWithoutEmailEmbeddingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEmailEmbeddingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEmailEmbeddingsInput, UserUncheckedUpdateWithoutEmailEmbeddingsInput>
  }

  export type UserUpdateWithoutEmailEmbeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEmailEmbeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUncheckedUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUncheckedUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUncheckedUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutPriorityScoresInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionCreateNestedManyWithoutUserInput
    preference?: UserPreferenceCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPriorityScoresInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkUncheckedCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingUncheckedCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionUncheckedCreateNestedManyWithoutUserInput
    preference?: UserPreferenceUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPriorityScoresInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPriorityScoresInput, UserUncheckedCreateWithoutPriorityScoresInput>
  }

  export type UserUpsertWithoutPriorityScoresInput = {
    update: XOR<UserUpdateWithoutPriorityScoresInput, UserUncheckedUpdateWithoutPriorityScoresInput>
    create: XOR<UserCreateWithoutPriorityScoresInput, UserUncheckedCreateWithoutPriorityScoresInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPriorityScoresInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPriorityScoresInput, UserUncheckedUpdateWithoutPriorityScoresInput>
  }

  export type UserUpdateWithoutPriorityScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPriorityScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUncheckedUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUncheckedUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUncheckedUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutPendingActionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreCreateNestedManyWithoutUserInput
    preference?: UserPreferenceCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPendingActionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkUncheckedCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingUncheckedCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreUncheckedCreateNestedManyWithoutUserInput
    preference?: UserPreferenceUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPendingActionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPendingActionsInput, UserUncheckedCreateWithoutPendingActionsInput>
  }

  export type UserUpsertWithoutPendingActionsInput = {
    update: XOR<UserUpdateWithoutPendingActionsInput, UserUncheckedUpdateWithoutPendingActionsInput>
    create: XOR<UserCreateWithoutPendingActionsInput, UserUncheckedCreateWithoutPendingActionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPendingActionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPendingActionsInput, UserUncheckedUpdateWithoutPendingActionsInput>
  }

  export type UserUpdateWithoutPendingActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPendingActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUncheckedUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUncheckedUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUncheckedUpdateManyWithoutUserNestedInput
    preference?: UserPreferenceUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutPreferenceInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPreferenceInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gmailBackfilledAt?: Date | string | null
    calendarBackfilledAt?: Date | string | null
    channelLinks?: ChannelLinkUncheckedCreateNestedManyWithoutUserInput
    emailEmbeddings?: EmailEmbeddingUncheckedCreateNestedManyWithoutUserInput
    priorityScores?: PriorityScoreUncheckedCreateNestedManyWithoutUserInput
    pendingActions?: PendingActionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPreferenceInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPreferenceInput, UserUncheckedCreateWithoutPreferenceInput>
  }

  export type UserUpsertWithoutPreferenceInput = {
    update: XOR<UserUpdateWithoutPreferenceInput, UserUncheckedUpdateWithoutPreferenceInput>
    create: XOR<UserCreateWithoutPreferenceInput, UserUncheckedCreateWithoutPreferenceInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPreferenceInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPreferenceInput, UserUncheckedUpdateWithoutPreferenceInput>
  }

  export type UserUpdateWithoutPreferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPreferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gmailBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calendarBackfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channelLinks?: ChannelLinkUncheckedUpdateManyWithoutUserNestedInput
    emailEmbeddings?: EmailEmbeddingUncheckedUpdateManyWithoutUserNestedInput
    priorityScores?: PriorityScoreUncheckedUpdateManyWithoutUserNestedInput
    pendingActions?: PendingActionUncheckedUpdateManyWithoutUserNestedInput
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

  export type ChannelLinkCreateManyUserInput = {
    id?: string
    channel: string
    externalChatId: string
    linkedAt?: Date | string
  }

  export type EmailEmbeddingCreateManyUserInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    subjectSnippet: string
    indexedAt?: Date | string
  }

  export type PriorityScoreCreateManyUserInput = {
    id?: string
    corsairEntityId: string
    threadId: string
    label: string
    reason?: string | null
    model?: string | null
    createdAt?: Date | string
  }

  export type PendingActionCreateManyUserInput = {
    id?: string
    channel: string
    kind: string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: string | null
    status?: string
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type ChannelLinkUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChannelLinkUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChannelLinkUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    externalChatId?: StringFieldUpdateOperationsInput | string
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailEmbeddingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailEmbeddingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailEmbeddingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    subjectSnippet?: StringFieldUpdateOperationsInput | string
    indexedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorityScoreUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorityScoreUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorityScoreUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    corsairEntityId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingActionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PendingActionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PendingActionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    draftPayload?: JsonNullValueInput | InputJsonValue
    corsairOperationPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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