
export interface CreateMessageListItemType {
    email: string;
    name: string;
    spokenLanguage: string;
    images?: Array<any>;
    userUid: string;
    status?: boolean;
    onImagePress?: (imagePath: string) => void;
    onPress?: () => void;
    onLongPress?: (event: any) => void;
}