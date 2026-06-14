"use client";

import * as React from "react";

/**
 * Lightweight shared context so the command palette and keyboard layer know
 * what the user is currently looking at / has selected. The inbox publishes its
 * focused + multi-selected threads here; the palette reads them to offer
 * context-aware thread actions and to scope "Ask AI" to the selection.
 *
 * Falls back to an empty selection when no provider is mounted, so consumers
 * never need a null check.
 */
export interface CommandSelection {
  view: string;
  focusedThreadId: string | null;
  selectedThreadIds: string[];
}

const EMPTY: CommandSelection = {
  view: "",
  focusedThreadId: null,
  selectedThreadIds: [],
};

interface CommandContextValue {
  selection: CommandSelection;
  setSelection: (next: Partial<CommandSelection>) => void;
}

const CommandContext = React.createContext<CommandContextValue>({
  selection: EMPTY,
  setSelection: () => undefined,
});

export function CommandContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selection, setState] = React.useState<CommandSelection>(EMPTY);
  const setSelection = React.useCallback(
    (next: Partial<CommandSelection>) =>
      setState((prev) => ({ ...prev, ...next })),
    [],
  );
  const value = React.useMemo(
    () => ({ selection, setSelection }),
    [selection, setSelection],
  );
  return (
    <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
  );
}

export function useCommandContext(): CommandContextValue {
  return React.useContext(CommandContext);
}

/**
 * Publish the current view + selected threads from a view component. Updates
 * whenever the inputs change and clears `focusedThreadId` on unmount.
 */
export function usePublishCommandSelection(
  partial: Partial<CommandSelection>,
): void {
  const { setSelection } = useCommandContext();
  const view = partial.view;
  const focusedThreadId = partial.focusedThreadId ?? null;
  const ids = partial.selectedThreadIds ?? [];
  const idsKey = ids.join(",");
  React.useEffect(() => {
    setSelection({ view, focusedThreadId, selectedThreadIds: ids });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelection, view, focusedThreadId, idsKey]);
}
