export interface ChatDetailedListItemType {
    content: string;
    editedTranslatedContent?: string;
    editedContent?: string;
    translatedContent: string;
    showTranslatedContent?: boolean;
    userUid: string;
    recording?: string;
    id: string;
    date: any;
    language: string;
    voiceMessage?: string;
    playingRecording?: boolean;
    playingVoice?: boolean;
    onOverlayPress?: () => void;
    onPress?: () => void;
    onLongPress?: (event: any) => void;
}