import { ChatDetailedListItemType } from '../../../chat-detailed/components/chat-detailed-list-item';


export interface ChatBasicListItemType {
    id?: string;
    content: string;
    name: string;
    unRead?: string;
    translatedContent: string;
    date?: string;
    detailedChatList: Array<ChatDetailedListItemType>;
    otherUsersSettings: any;
    typing?: string;
    onImagePress?: (imagePath: string) => void;
    onPress?: () => void;
    onLongPress?: (event: any) => void;
}