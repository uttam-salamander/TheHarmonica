import { beforeEach, describe, expect, test } from "bun:test";
import { useSettingsStore } from "@/stores/settingsStore";

describe("settingsStore", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      harmonicaKey: "C",
      metronomeSound: true,
      countIn: true,
      waitModeDefault: true,
      defaultTempo: null,
    });
  });

  test("starts with lesson tempo mode enabled", () => {
    expect(useSettingsStore.getState().defaultTempo).toBeNull();
  });

  test("can set explicit default tempo", () => {
    useSettingsStore.getState().setDefaultTempo(95);
    expect(useSettingsStore.getState().defaultTempo).toBe(95);
  });

  test("clamps default tempo to minimum", () => {
    useSettingsStore.getState().setDefaultTempo(20);
    expect(useSettingsStore.getState().defaultTempo).toBe(40);
  });

  test("clamps default tempo to maximum", () => {
    useSettingsStore.getState().setDefaultTempo(260);
    expect(useSettingsStore.getState().defaultTempo).toBe(200);
  });

  test("can switch back to lesson tempo mode", () => {
    useSettingsStore.getState().setDefaultTempo(100);
    useSettingsStore.getState().setDefaultTempo(null);
    expect(useSettingsStore.getState().defaultTempo).toBeNull();
  });
});
