export declare class LaraPagination {
    private STRUCTURE;
    private INTERFACE;
    private SETTINGS;
    private STATE;
    private reference;
    private LISTENERS;
    set onPrev(listen: (event: any) => void);
    set onNext(listen: (event: any) => void);
    set onFirst(listen: (event: any) => void);
    set onLast(listen: (event: any) => void);
    set onChange(listen: (event: any) => void);
    constructor(selector: string, options?: {
        loadStylePagination?: boolean;
        stylePagination?: "number" | "letter" | "romano";
        typePagination?: "separator" | "fraction" | "single" | "basic" | "fraction-basic" | "maximum" | "fraction-maximum" | "full" | "fraction-full" | "full-reverse" | "fraction-full-reverse";
        numberPages?: number;
        breakPage?: number;
        lastPage?: number;
        behaviorBasicButton?: "hidden" | "disabled";
        behaviorMaximumButton?: "hidden" | "disabled";
        disable?: boolean;
    });
    setInterface(options?: {
        button_next?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_prev?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_first?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        button_last?: {
            label: string;
            icon_left: string;
            icon_right: string;
        };
        separator?: string;
    }): void;
    getPage(): number;
    getLastPage(): number;
    selectPage(page: number): void;
    prevPage(): void;
    nextPage(): void;
    firstPage(): void;
    lastPage(): void;
    private initPagination;
    private makeBasicButton;
    private makeMaximumButton;
    private initBasicButton;
    private initMaximumButton;
    private initFullButton;
    private render;
    private behaviorBasicButton;
    private behaviorMaximumButton;
    private handleClickItems;
    private handleClickBasicButton;
    private handleClickMaximumButton;
    private changeNumberPagination;
    private changeStateInterface;
    private loadStylePagination;
    private getPositionPage;
    private transformArrayPages;
    private convertLabel;
    private convertNumberToRoman;
    private convertNumberToAlphabet;
}
