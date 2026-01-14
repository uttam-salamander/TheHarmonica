"use client";

import Link from "next/link";
import { ArrowLeft, Mic, Volume2 } from "lucide-react";
import { useState } from "react";

const harmonicaKeys = ["C", "A", "G", "D", "E", "F", "Bb", "Eb", "Ab"];

export default function SettingsPage() {
  const [selectedKey, setSelectedKey] = useState("C");
  const [waitModeDefault, setWaitModeDefault] = useState(true);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Harmonica Key */}
          <section className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4">Harmonica Key</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select the key of your harmonica. This affects note detection and tablature display.
            </p>
            <div className="flex flex-wrap gap-2">
              {harmonicaKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedKey === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </section>

          {/* Microphone */}
          <section className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mic size={20} />
              Microphone
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Input Device</label>
                <select className="w-full p-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Default Microphone</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg">
                Calibrate Microphone
              </button>
              <p className="text-xs text-muted-foreground">
                Calibration helps filter out background noise for better detection.
              </p>
            </div>
          </section>

          {/* Audio */}
          <section className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Volume2 size={20} />
              Audio
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Metronome Sound</div>
                  <div className="text-sm text-muted-foreground">Play click sound on beat</div>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Count-in</div>
                  <div className="text-sm text-muted-foreground">3-2-1 countdown before exercises</div>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
            </div>
          </section>

          {/* Practice */}
          <section className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4">Practice Defaults</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Wait Mode</div>
                  <div className="text-sm text-muted-foreground">Pause until correct note is played</div>
                </div>
                <ToggleSwitch
                  checked={waitModeDefault}
                  onChange={setWaitModeDefault}
                />
              </div>
            </div>
          </section>

          {/* About */}
          <section className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4">About HarpFlow</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Version 0.1.0</p>
              <p>Learn harmonica with real-time feedback.</p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ToggleSwitch({
  checked,
  defaultChecked,
  onChange,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState(checked ?? defaultChecked ?? false);
  const actualChecked = checked ?? isChecked;

  return (
    <button
      role="switch"
      aria-checked={actualChecked}
      onClick={() => {
        const newValue = !actualChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
      }}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        actualChecked ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          actualChecked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}
