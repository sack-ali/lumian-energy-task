export interface Facility {
    id: string;
    name: string;
    distributionCompanyName: string;
    createdAt: string;
    updatedAt: string;
}

export interface APIResponse {
    result: {
        columns: { header: string; columnId: string; dataType: string; options: any }[];
        values: Facility[];
    };
}
