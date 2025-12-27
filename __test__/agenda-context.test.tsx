import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { AgendaProvider, useAgenda } from "@/lib/agenda-context";

describe("AgendaContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty agenda", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    expect(result.current.agendaSessionIds).toEqual([]);
  });

  it("should add session to agenda", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    act(() => {
      result.current.addToAgenda("session-1");
    });

    expect(result.current.agendaSessionIds).toContain("session-1");
  });

  it("should remove session from agenda", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    act(() => {
      result.current.addToAgenda("session-1");
      result.current.addToAgenda("session-2");
    });

    expect(result.current.agendaSessionIds).toHaveLength(2);

    act(() => {
      result.current.removeFromAgenda("session-1");
    });

    expect(result.current.agendaSessionIds).toHaveLength(1);
    expect(result.current.agendaSessionIds).not.toContain("session-1");
    expect(result.current.agendaSessionIds).toContain("session-2");
  });

  it("should check if session is in agenda", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    act(() => {
      result.current.addToAgenda("session-1");
    });

    expect(result.current.isInAgenda("session-1")).toBe(true);
    expect(result.current.isInAgenda("session-2")).toBe(false);
  });

  it("should clear all sessions from agenda", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    act(() => {
      result.current.addToAgenda("session-1");
      result.current.addToAgenda("session-2");
      result.current.addToAgenda("session-3");
    });

    expect(result.current.agendaSessionIds).toHaveLength(3);

    act(() => {
      result.current.clearAgenda();
    });

    expect(result.current.agendaSessionIds).toEqual([]);
  });

  it("should not add duplicate sessions", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    act(() => {
      result.current.addToAgenda("session-1");
      result.current.addToAgenda("session-1");
    });

    expect(result.current.agendaSessionIds).toHaveLength(1);
  });

  it("should persist agenda to localStorage", () => {
    const { result } = renderHook(() => useAgenda(), {
      wrapper: AgendaProvider,
    });

    act(() => {
      result.current.addToAgenda("session-1");
      result.current.addToAgenda("session-2");
    });

    const stored = localStorage.getItem("conference-agenda");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(["session-1", "session-2"]);
  });
});
