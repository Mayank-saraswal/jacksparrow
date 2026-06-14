/**
 * Pure decision for "has the user interacted with this sender before?" — derived
 * entirely from local signals (no provider calls). A sender is known when the
 * user has previously sent mail to the sender's domain, or has an existing
 * synced item from that exact address.
 */
export interface KnownSenderSignals {
  /** A SentMessageSample exists for the sender's domain. */
  hasSampleForDomain: boolean;
  /** A SyncItem exists whose fromEmail matches the sender. */
  hasSyncItemFromSender: boolean;
}

export function knownSenderDecision(signals: KnownSenderSignals): boolean {
  return signals.hasSampleForDomain || signals.hasSyncItemFromSender;
}
