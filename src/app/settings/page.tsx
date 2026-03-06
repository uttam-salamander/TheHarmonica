"use client";

import Link from "next/link";
import { ArrowLeft, Mic, Volume2, Music2, Settings2, Info, ChevronRight } from "lucide-react";
import { useSettingsStore, type HarmonicaKey } from "@/stores/settingsStore";

const harmonicaKeys: HarmonicaKey[] = ["C", "A", "G", "D", "E", "F", "Bb", "Eb", "Ab"];

export default function SettingsPage() {
  const {
    harmonicaKey,
    metronomeSound,
    countIn,
    waitModeDefault,
    defaultTempo,
    setHarmonicaKey,
    setMetronomeSound,
    setCountIn,
    setWaitModeDefault,
    setDefaultTempo,
  } = useSettingsStore();

  return (
    <main className="min-h-screen p-6 md:p-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-10">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </header>

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-muted-foreground">Customize your HarpFlow experience</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6 reveal-stagger">
          {/* Harmonica Key */}
          <section className="glass-card rounded-xl p-6 border-accent">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-amber" />
              </div>
              <div>
                <h2 className="font-display text-xl">Harmonica Key</h2>
                <p className="text-xs text-muted-foreground">Affects note detection and tablature</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {harmonicaKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setHarmonicaKey(key)}
                  className={`w-12 h-12 rounded-xl font-display text-lg transition-all ${
                    harmonicaKey === key
                      ? "bg-gradient-to-br from-amber to-amber-dark text-background shadow-lg shadow-amber/30 scale-105"
                      : "bg-secondary hover:bg-secondary/80 hover:scale-105"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </section>

          {/* Microphone */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blow/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-blow" />
              </div>
              <div>
                <h2 className="font-display text-xl">Microphone</h2>
                <p className="text-xs text-muted-foreground">Audio input settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Input Device</label>
                <select className="w-full p-3 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-amber transition-all">
                  <option>Default Microphone</option>
                </select>
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <Settings2 size={16} />
                Calibrate Microphone
              </button>
              <p className="text-xs text-muted-foreground">
                Calibration helps filter out background noise for better detection.
              </p>
            </div>
          </section>

          {/* Audio */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-draw/20 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-draw" />
              </div>
              <div>
                <h2 className="font-display text-xl">Audio</h2>
                <p className="text-xs text-muted-foreground">Sound output preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <SettingToggle
                title="Metronome Sound"
                description="Play click sound on beat"
                checked={metronomeSound}
                onChange={setMetronomeSound}
              />
              <SettingToggle
                title="Count-in"
                description="3-2-1 countdown before exercises"
                checked={countIn}
                onChange={setCountIn}
              />
            </div>
          </section>

          {/* Practice */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-correct/20 flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-correct" />
              </div>
              <div>
                <h2 className="font-display text-xl">Practice Defaults</h2>
                <p className="text-xs text-muted-foreground">Default lesson settings</p>
              </div>
            </div>
            <SettingToggle
              title="Wait Mode"
              description="Pause until correct note is played"
              checked={waitModeDefault}
              onChange={setWaitModeDefault}
            />
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <SettingToggle
                title="Use Lesson Tempo"
                description="Use each lesson's recommended BPM"
                checked={defaultTempo === null}
                onChange={(enabled) => setDefaultTempo(enabled ? null : 80)}
              />

              <div className={defaultTempo === null ? "opacity-50 pointer-events-none" : ""}>
                <label className="text-sm text-muted-foreground block mb-2">Default Tempo Override</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDefaultTempo((defaultTempo ?? 80) - 5)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-medium"
                    aria-label="Decrease tempo"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-display text-xl">
                    {defaultTempo ?? 80}
                  </span>
                  <button
                    onClick={() => setDefaultTempo((defaultTempo ?? 80) + 5)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-medium"
                    aria-label="Increase tempo"
                  >
                    +
                  </button>
                  <span className="text-sm text-muted-foreground">BPM</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Used only when lesson tempo is disabled.
                </p>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-xl">About HarpFlow</h2>
                <p className="text-xs text-muted-foreground">App information</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">0.1.0</span>
              </div>
              <p className="text-sm text-muted-foreground py-2">
                Learn harmonica with real-time pitch detection and visual feedback.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-sm text-amber hover:text-amber-light transition-colors flex items-center gap-1">
                  Privacy Policy
                  <ChevronRight size={14} />
                </a>
                <a href="#" className="text-sm text-amber hover:text-amber-light transition-colors flex items-center gap-1">
                  Terms of Service
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-7 rounded-full transition-all ${
          checked
            ? "bg-gradient-to-r from-amber to-amber-dark shadow-md shadow-amber/30"
            : "bg-secondary"
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full bg-foreground shadow-sm transition-transform ${
            checked ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
