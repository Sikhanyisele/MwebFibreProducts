export interface IProducts {
    code: string;
    name: string;
    description: string;
    category: string;
    isStandardCampaign?: boolean;
    isDefaultCampaign?: boolean;
    isPrivateCampaign?: boolean;
    promocodes?: string [];
    links: string [];
}
