export class CreateCategoryDto {
    name: string;
    description: string;
    
}

export class CreateForumDto {
    name: string;
    description: string;
    slug: string;
    category_id: number;
}
