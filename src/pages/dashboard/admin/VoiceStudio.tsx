import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Volume2, Star, Trash2, Upload, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import VoicePlayerButton from "@/components/voice/VoicePlayerButton";

interface VoiceRow {
  id: string;
  voice_id: string;
  label: string;
  description: string | null;
  is_cloned: boolean;
  enabled_for_site: boolean;
  is_default: boolean;
  preview_url: string | null;
}

interface ElevenVoice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
}

const PREVIEW_TEXT =
  "Welcome to Digital Penta. This is a voice sample used to preview how narration will sound on your site.";

export default function VoiceStudio() {
  const [voices, setVoices] = useState<ElevenVoice[]>([]);
  const [saved, setSaved] = useState<VoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewText, setPreviewText] = useState(PREVIEW_TEXT);
  const [selectedPreview, setSelectedPreview] = useState<string>("");
  const [cloneName, setCloneName] = useState("");
  const [cloneDesc, setCloneDesc] = useState("");
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [cloning, setCloning] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: eleven, error: elErr }, { data: rows }] = await Promise.all([
        supabase.functions.invoke("elevenlabs-voices", { body: { action: "list" } }),
        supabase.from("voice_settings").select("*").order("created_at", { ascending: false }),
      ]);
      if (elErr) throw elErr;
      setVoices(eleven?.voices ?? []);
      setSaved((rows as VoiceRow[]) ?? []);
      if ((eleven?.voices?.length ?? 0) > 0 && !selectedPreview) {
        setSelectedPreview(eleven.voices[0].voice_id);
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load voices", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const saveVoice = async (v: ElevenVoice) => {
    const { error } = await supabase.from("voice_settings").upsert({
      voice_id: v.voice_id,
      label: v.name,
      description: v.description ?? null,
      is_cloned: v.category === "cloned",
      enabled_for_site: false,
      preview_url: v.preview_url ?? null,
    }, { onConflict: "voice_id" });
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Voice saved" });
    load();
  };

  const toggleEnabled = async (row: VoiceRow) => {
    const { error } = await supabase
      .from("voice_settings")
      .update({ enabled_for_site: !row.enabled_for_site })
      .eq("id", row.id);
    if (error) { toast({ title: "Update failed", variant: "destructive" }); return; }
    load();
  };

  const setDefault = async (row: VoiceRow) => {
    await supabase.from("voice_settings").update({ is_default: false }).neq("id", row.id);
    await supabase.from("voice_settings").update({ is_default: true, enabled_for_site: true }).eq("id", row.id);
    toast({ title: `${row.label} set as default` });
    load();
  };

  const removeSaved = async (row: VoiceRow) => {
    if (!confirm(`Remove ${row.label} from site voices?`)) return;
    await supabase.from("voice_settings").delete().eq("id", row.id);
    load();
  };

  const cloneVoice = async () => {
    if (!cloneName || !cloneFile) {
      toast({ title: "Name and audio file required", variant: "destructive" });
      return;
    }
    setCloning(true);
    try {
      const reader = new FileReader();
      const b64 = await new Promise<string>((res, rej) => {
        reader.onload = () => res(String(reader.result).split(",")[1] ?? "");
        reader.onerror = rej;
        reader.readAsDataURL(cloneFile);
      });
      const { data, error } = await supabase.functions.invoke("elevenlabs-voices", {
        body: {
          action: "clone",
          name: cloneName,
          description: cloneDesc,
          fileB64: b64,
          fileName: cloneFile.name,
          mime: cloneFile.type,
        },
      });
      if (error || data?.error) throw new Error(data?.error ?? error?.message);
      toast({ title: "Voice cloned", description: `${cloneName} is ready to preview.` });
      setCloneName(""); setCloneDesc(""); setCloneFile(null);
      load();
    } catch (e: any) {
      console.error(e);
      toast({ title: "Clone failed", description: e.message ?? "Try a clean 30-60s sample", variant: "destructive" });
    } finally {
      setCloning(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
          <Mic className="w-7 h-7 text-primary" /> Voice Studio
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage ElevenLabs voices, clone new ones, and choose which appear on the public site.
        </p>
      </div>

      {/* Preview */}
      <section className="glass-card p-6">
        <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Preview any voice
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <textarea
              rows={3}
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value.slice(0, 500))}
              className="w-full rounded-lg bg-card border border-white/10 p-3 text-sm text-foreground"
            />
          </div>
          <div className="space-y-3">
            <select
              value={selectedPreview}
              onChange={(e) => setSelectedPreview(e.target.value)}
              className="w-full rounded-lg bg-card border border-white/10 p-3 text-sm text-foreground"
            >
              {voices.map((v) => (
                <option key={v.voice_id} value={v.voice_id}>{v.name} {v.category === "cloned" ? "· Cloned" : ""}</option>
              ))}
            </select>
            <VoicePlayerButton
              text={previewText}
              voiceId={selectedPreview}
              label="Preview voice"
              variant="premium"
              className="w-full justify-center"
            />
          </div>
        </div>
      </section>

      {/* Clone */}
      <section className="glass-card p-6">
        <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-accent" /> Clone a new voice
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Voice name (e.g. Harish CEO)"
            value={cloneName}
            onChange={(e) => setCloneName(e.target.value)}
            className="rounded-lg bg-card border border-white/10 p-3 text-sm text-foreground"
          />
          <input
            placeholder="Description (optional)"
            value={cloneDesc}
            onChange={(e) => setCloneDesc(e.target.value)}
            className="rounded-lg bg-card border border-white/10 p-3 text-sm text-foreground"
          />
          <input
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
            onChange={(e) => setCloneFile(e.target.files?.[0] ?? null)}
            className="rounded-lg bg-card border border-white/10 p-3 text-sm text-foreground md:col-span-2"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Upload a 30–60s clean sample. Max 10 MB. Requires ElevenLabs plan with voice cloning enabled.
        </p>
        <Button onClick={cloneVoice} disabled={cloning || !cloneName || !cloneFile} className="mt-4">
          {cloning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
          Clone Voice
        </Button>
      </section>

      {/* Saved voices */}
      <section className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-foreground flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" /> Site voices
          </h2>
          <span className="text-xs text-muted-foreground">
            Only voices marked "Enabled for site" appear in narration.
          </span>
        </div>
        {saved.length === 0 ? (
          <p className="text-sm text-muted-foreground">No voices saved yet. Save one from the library below.</p>
        ) : (
          <div className="grid gap-3">
            {saved.map((row) => (
              <div key={row.id} className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg border border-white/10 bg-card/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-foreground">{row.label}</span>
                    {row.is_cloned && <span className="text-[10px] font-mono uppercase text-accent">Cloned</span>}
                    {row.is_default && <span className="text-[10px] font-mono uppercase text-primary">Default</span>}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{row.voice_id}</div>
                </div>
                <VoicePlayerButton text={previewText} voiceId={row.voice_id} label="Play" variant="ghost" />
                <label className="text-xs flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={row.enabled_for_site}
                    onChange={() => toggleEnabled(row)}
                  />
                  Enabled
                </label>
                <Button size="sm" variant="outline" onClick={() => setDefault(row)}>
                  <Star className="w-3.5 h-3.5 mr-1" /> Default
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeSaved(row)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ElevenLabs library */}
      <section className="glass-card p-6">
        <h2 className="font-display font-bold text-foreground mb-4">ElevenLabs library</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading voices…
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {voices.map((v) => {
              const alreadySaved = saved.some((s) => s.voice_id === v.voice_id);
              return (
                <div key={v.voice_id} className="p-3 rounded-lg border border-white/10 bg-card/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.category ?? "premade"} · {v.voice_id.slice(0, 12)}…</p>
                    </div>
                    <Button size="sm" variant="outline" disabled={alreadySaved} onClick={() => saveVoice(v)}>
                      {alreadySaved ? "Saved" : "Add"}
                    </Button>
                  </div>
                  {v.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{v.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
