import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import type { EvidenceFile } from '@/types/ticket';
import { EVIDENCE_MIME_TYPES } from '@/utils/ticket-evidence';

export type EvidenceSource = 'camera' | 'library' | 'document';

export type PickResult =
  | { status: 'picked'; file: EvidenceFile }
  | { status: 'cancelled' }
  | { status: 'denied' };

let counter = 0;
const nextId = () => `evidence-${Date.now()}-${(counter += 1)}`;

/** Opens the device camera, photo library or file picker and returns the chosen file. */
export async function pickEvidenceFile(source: EvidenceSource): Promise<PickResult> {
  if (source === 'document') {
    const result = await DocumentPicker.getDocumentAsync({
      type: [...EVIDENCE_MIME_TYPES],
      copyToCacheDirectory: true,
    });
    if (result.canceled) {
      return { status: 'cancelled' };
    }
    const asset = result.assets[0];
    return {
      status: 'picked',
      file: {
        id: nextId(),
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'application/octet-stream',
        sizeBytes: asset.size ?? 0,
      },
    };
  }

  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return { status: 'denied' };
    }
  }
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'] })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
  if (result.canceled) {
    return { status: 'cancelled' };
  }
  const asset = result.assets[0];
  return {
    status: 'picked',
    file: {
      id: nextId(),
      name: asset.fileName ?? 'photo.jpg',
      uri: asset.uri,
      mimeType: asset.mimeType ?? 'image/jpeg',
      sizeBytes: asset.fileSize ?? 0,
    },
  };
}
