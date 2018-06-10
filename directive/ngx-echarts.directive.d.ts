import { ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges, NgZone } from '@angular/core';
export declare class NgxEchartsDirective implements OnChanges, OnDestroy {
    private el;
    private _ngZone;
    options: any;
    theme: string;
    loading: boolean;
    initOpts: any;
    merge: any;
    autoResize: boolean;
    loadingType: string;
    loadingOpts: any;
    chartInit: EventEmitter<any>;
    chartClick: EventEmitter<any>;
    chartDblClick: EventEmitter<any>;
    chartMouseDown: EventEmitter<any>;
    chartMouseUp: EventEmitter<any>;
    chartMouseOver: EventEmitter<any>;
    chartMouseOut: EventEmitter<any>;
    chartGlobalOut: EventEmitter<any>;
    chartContextMenu: EventEmitter<any>;
    chartDataZoom: EventEmitter<any>;
    chartLegendselectchanged: EventEmitter<any>;
    private _chart;
    private currentWindowWidth;
    constructor(el: ElementRef, _ngZone: NgZone);
    private createChart();
    onWindowResize(event: any): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private onOptionsChange(opt);
    private registerEvents(_chart);
    clear(): void;
    toggleLoading(loading: boolean): void;
    setOption(option: any, opts?: any): void;
}
