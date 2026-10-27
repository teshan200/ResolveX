import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TicketContextCard } from '@/components/tickets/ticket-context-card';
import { Brand, InterFonts, Radius, Ring, Spacing } from '@/constants/theme';
import { pickEvidenceFile, type EvidenceSource } from '@/services/evidence-picker';
import { ticketsRepository } from '@/services/tickets';
import type { EvidenceFile, TicketEvidence, TicketSummary } from '@/types/ticket';
import {
  attachLabel,
  evidenceFileError,
  formatFileSize,
  formatUploadProgress,
} from '@/utils/ticket-evidence';

type EvidenceFormProps = {
  ticket: TicketSummary;
  saving: boolean;
  onSubmit: (evidence: TicketEvidence) => void;
};

type Entry = {
  file: EvidenceFile;
  /** Fraction uploaded (0 to 1). */
  progress: number;
  uploaded: boolean;
};

const SOURCE_OPTIONS: { text: string; source: EvidenceSource }[] = [
  { text: 'Take photo', source: 'camera' },
  { text: 'Choose from library', source: 'library' },
  { text: 'Choose PDF', source: 'document' },
];

/** Body and action bar of the "Add evidence" screen. */
export function EvidenceForm({ ticket, saving, onSubmit }: EvidenceFormProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [caption, setCaption] = useState('');
  const [captionFocused, setCaptionFocused] = useState(false);
  // Files removed or left behind while their upload is still running; their results are ignored.
  const discarded = useRef(new Set<string>());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const uploading = entries.some((entry) => !entry.uploaded);
  const canAttach = entries.length > 0 && !uploading && !saving;

  function updateEntry(id: string, change: Partial<Entry>) {
    if (!mounted.current || discarded.current.has(id)) {
      return;
    }
    setEntries((current) =>
      current.map((entry) => (entry.file.id === id ? { ...entry, ...change } : entry)),
    );
  }

  async function addFile(source: EvidenceSource) {
    let result;
    try {
      result = await pickEvidenceFile(source);
    } catch {
      Alert.alert('Couldn’t open files', 'Please try again.');
      return;
    }
    if (!mounted.current || result.status === 'cancelled') {
      return;
    }
    if (result.status === 'denied') {
      Alert.alert('Camera access needed', 'Allow camera access in Settings to take a photo.');
      return;
    }
    const { file } = result;
    const error = evidenceFileError(file);
    if (error) {
      Alert.alert('File not added', error);
      return;
    }
    setEntries((current) => [...current, { file, progress: 0, uploaded: false }]);
    try {
      await ticketsRepository.uploadEvidenceFile(ticket.id, file, (fraction) =>
        updateEntry(file.id, { progress: fraction }),
      );
      updateEntry(file.id, { progress: 1, uploaded: true });
    } catch {
      if (mounted.current && !discarded.current.has(file.id)) {
        discarded.current.add(file.id);
        setEntries((current) => current.filter((entry) => entry.file.id !== file.id));
        Alert.alert('Upload failed', `We couldn’t upload ${file.name}. Please try again.`);
      }
    }
  }

  function removeEntry(id: string) {
    discarded.current.add(id);
    setEntries((current) => current.filter((entry) => entry.file.id !== id));
  }

  function chooseSource() {
    // Alert.alert is a no-op on web, so go straight to the browser's file dialog (JPG, PNG or PDF).
    if (Platform.OS === 'web') {
      void addFile('document');
      return;
    }
    Alert.alert('Add evidence', undefined, [
      ...SOURCE_OPTIONS.map(({ text, source }) => ({ text, onPress: () => void addFile(source) })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <TicketContextCard ticket={ticket} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tap to capture or upload"
          onPress={chooseSource}
          style={styles.dropzone}>
          <View style={styles.iconWrap}>
            <Image
              source={require('@/assets/images/evidence/dropzone-camera.svg')}
              style={styles.dropzoneIcon}
              contentFit="contain"
            />
          </View>
          <Text style={styles.dropzoneTitle}>Tap to capture or upload</Text>
          <Text style={styles.hint}>JPG, PNG or PDF · max 10 MB</Text>
        </Pressable>

        {entries.length > 0 && (
          <View style={styles.files}>
            <Text style={styles.overline}>
              {entries.length} {entries.length === 1 ? 'file' : 'files'}
            </Text>
            {entries.map((entry) => (
              <FileRow key={entry.file.id} entry={entry} onRemove={() => removeEntry(entry.file.id)} />
            ))}
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            accessibilityLabel="Caption"
            value={caption}
            onChangeText={setCaption}
            onFocus={() => setCaptionFocused(true)}
            onBlur={() => setCaptionFocused(false)}
            style={[styles.input, captionFocused && styles.inputFocused]}
          />
        </View>

        <View style={styles.scanNote}>
          <Image
            source={require('@/assets/images/evidence/scan-shield.svg')}
            style={styles.scanIcon}
            contentFit="contain"
          />
          <Text style={styles.scanText}>
            Files are scanned for malware before attaching · max 10 MB
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canAttach }}
          disabled={!canAttach}
          onPress={() => onSubmit({ files: entries.map((entry) => entry.file), caption: caption.trim() })}
          style={[styles.attach, !canAttach && styles.attachDisabled]}>
          <Image
            source={require('@/assets/images/evidence/attach-paperclip.svg')}
            style={styles.attachIcon}
            contentFit="contain"
          />
          <Text style={styles.attachText}>{attachLabel(entries.length)}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function FileRow({ entry, onRemove }: { entry: Entry; onRemove: () => void }) {
  const { file, progress, uploaded } = entry;
  return (
    <View style={styles.file}>
      <View style={styles.thumb}>
        <Image
          source={require('@/assets/images/evidence/file-image.svg')}
          style={styles.thumbIcon}
          contentFit="contain"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
        {!uploaded && (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
        )}
        <Text style={styles.hint}>
          {uploaded
            ? `${formatFileSize(file.sizeBytes)} · Uploaded · scanned clean`
            : formatUploadProgress(progress, file.sizeBytes)}
        </Text>
      </View>
      {uploaded ? (
        <Image
          source={require('@/assets/images/evidence/file-uploaded.svg')}
          style={styles.statusIcon}
          contentFit="contain"
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cancel upload of ${file.name}`}
          hitSlop={12}
          onPress={onRemove}>
          <Image
            source={require('@/assets/images/evidence/file-remove.svg')}
            style={styles.statusIcon}
            contentFit="contain"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  dropzone: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    backgroundColor: Brand.bgBrandSubtle,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Brand.borderBrand,
    borderRadius: Radius.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.bgSurface,
    borderRadius: 999,
  },
  dropzoneIcon: {
    width: 22,
    height: 22,
  },
  dropzoneTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textBrand,
  },
  hint: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  files: {
    gap: Spacing.two,
  },
  overline: {
    fontFamily: InterFonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: Brand.textTertiary,
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.lg,
  },
  thumb: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.bgMuted,
    borderRadius: Radius.md,
  },
  thumbIcon: {
    width: 20,
    height: 20,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  fileName: {
    fontFamily: InterFonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  track: {
    height: 8,
    overflow: 'hidden',
    backgroundColor: Brand.bgMuted,
    borderRadius: 999,
  },
  fill: {
    height: 8,
    backgroundColor: Brand.bgBrand,
    borderRadius: 999,
  },
  statusIcon: {
    width: 18,
    height: 18,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textPrimary,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: Brand.borderFocus,
    boxShadow: `0 0 0 3px ${Ring.focus}`,
  },
  scanNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  scanIcon: {
    width: 14,
    height: 14,
  },
  scanText: {
    flex: 1,
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  actionBar: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    backgroundColor: Brand.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Brand.borderSubtle,
  },
  attach: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: 20,
    backgroundColor: Brand.bgBrand,
    borderRadius: Radius.md,
  },
  attachDisabled: {
    opacity: 0.6,
  },
  attachIcon: {
    width: 20,
    height: 20,
  },
  attachText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textOnBrand,
  },
});
