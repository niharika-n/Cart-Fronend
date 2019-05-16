export interface CategoryModel {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    isActive: boolean;
    createdBy: number;
    createdDate: Date;
    createdUser: string;
    parentCategory: boolean;
    childCategory?: number;
    imageContent?: any;
    imageId: number;
    associatedProducts?: number;
}
