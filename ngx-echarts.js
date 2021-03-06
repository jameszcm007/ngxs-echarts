import { Directive, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, NgZone, Output } from '@angular/core';
import { Observable as Observable$1 } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';

class ChangeFilter {
    /**
     * @param {?} _changes
     */
    constructor(_changes) {
        this._changes = _changes;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    static of(changes) {
        return new ChangeFilter(changes);
    }
    /**
     * @template T
     * @param {?} key
     * @return {?}
     */
    notEmpty(key) {
        if (this._changes[key]) {
            let /** @type {?} */ value = this._changes[key].currentValue;
            if (value !== undefined && value !== null) {
                return Observable$1.of(value);
            }
        }
        return Observable$1.empty();
    }
    /**
     * @template T
     * @param {?} key
     * @return {?}
     */
    has(key) {
        if (this._changes[key]) {
            let /** @type {?} */ value = this._changes[key].currentValue;
            return Observable$1.of(value);
        }
        return Observable$1.empty();
    }
}

class NgxEchartsDirective {
    /**
     * @param {?} el
     * @param {?} _ngZone
     */
    constructor(el, _ngZone) {
        this.el = el;
        this._ngZone = _ngZone;
        this.autoResize = true;
        this.loadingType = 'default';
        // chart events:
        this.chartInit = new EventEmitter();
        this.chartClick = new EventEmitter();
        this.chartDblClick = new EventEmitter();
        this.chartMouseDown = new EventEmitter();
        this.chartMouseUp = new EventEmitter();
        this.chartMouseOver = new EventEmitter();
        this.chartMouseOut = new EventEmitter();
        this.chartGlobalOut = new EventEmitter();
        this.chartContextMenu = new EventEmitter();
        this.chartDataZoom = new EventEmitter();
        this.chartLegendselectchanged = new EventEmitter();
        this._chart = null;
        this.currentWindowWidth = null;
    }
    /**
     * @return {?}
     */
    createChart() {
        this.currentWindowWidth = window.innerWidth;
        let /** @type {?} */ dom = this.el.nativeElement;
        if (window && window.getComputedStyle) {
            let /** @type {?} */ prop = window.getComputedStyle(dom, null).getPropertyValue('height');
            if ((!prop || prop === '0px') &&
                (!dom.style.height || dom.style.height === '0px')) {
                dom.style.height = '400px';
            }
        }
        return this._ngZone.runOutsideAngular(() => echarts.init(dom, this.theme || undefined, this.initOpts || undefined));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onWindowResize(event) {
        if (this.autoResize && event.target.innerWidth !== this.currentWindowWidth) {
            this.currentWindowWidth = event.target.innerWidth;
            if (this._chart) {
                this._chart.resize();
            }
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ filter = ChangeFilter.of(changes);
        filter.notEmpty('options').subscribe(opt => this.onOptionsChange(opt));
        filter.notEmpty('merge').subscribe(opt => this.setOption(opt));
        filter.has('loading').subscribe(v => this.toggleLoading(!!v));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._chart) {
            this._chart.dispose();
            this._chart = null;
        }
    }
    /**
     * @param {?} opt
     * @return {?}
     */
    onOptionsChange(opt) {
        if (opt) {
            if (!this._chart) {
                this._chart = this.createChart();
                // output echart instance:
                this.chartInit.emit(this._chart);
                // register events:
                this.registerEvents(this._chart);
            }
            this._chart.setOption(this.options, true);
            this._chart.resize();
        }
    }
    /**
     * @param {?} _chart
     * @return {?}
     */
    registerEvents(_chart) {
        if (_chart) {
            // register mouse events:
            _chart.on('click', e => this._ngZone.run(() => this.chartClick.emit(e)));
            _chart.on('dblClick', e => this._ngZone.run(() => this.chartDblClick.emit(e)));
            _chart.on('mousedown', e => this._ngZone.run(() => this.chartMouseDown.emit(e)));
            _chart.on('mouseup', e => this._ngZone.run(() => this.chartMouseUp.emit(e)));
            _chart.on('mouseover', e => this._ngZone.run(() => this.chartMouseOver.emit(e)));
            _chart.on('mouseout', e => this._ngZone.run(() => this.chartMouseOut.emit(e)));
            _chart.on('globalout', e => this._ngZone.run(() => this.chartGlobalOut.emit(e)));
            _chart.on('contextmenu', e => this._ngZone.run(() => this.chartContextMenu.emit(e)));
            // other events;
            _chart.on('datazoom', e => this._ngZone.run(() => this.chartDataZoom.emit(e)));
            _chart.on('legendselectchanged', e => this._ngZone.run(() => this.chartLegendselectchanged.emit(e)));
        }
    }
    /**
     * @return {?}
     */
    clear() {
        if (this._chart) {
            this._chart.clear();
        }
    }
    /**
     * @param {?} loading
     * @return {?}
     */
    toggleLoading(loading) {
        if (this._chart) {
            loading ? this._chart.showLoading(this.loadingType, this.loadingOpts) : this._chart.hideLoading();
        }
    }
    /**
     * @param {?} option
     * @param {?=} opts
     * @return {?}
     */
    setOption(option, opts) {
        if (this._chart) {
            this._chart.setOption(option, opts);
        }
    }
}
NgxEchartsDirective.decorators = [
    { type: Directive, args: [{
                selector: 'echarts, [echarts]'
            },] },
];
/**
 * @nocollapse
 */
NgxEchartsDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: NgZone, },
];
NgxEchartsDirective.propDecorators = {
    'options': [{ type: Input },],
    'theme': [{ type: Input },],
    'loading': [{ type: Input },],
    'initOpts': [{ type: Input },],
    'merge': [{ type: Input },],
    'autoResize': [{ type: Input },],
    'loadingType': [{ type: Input },],
    'loadingOpts': [{ type: Input },],
    'chartInit': [{ type: Output },],
    'chartClick': [{ type: Output },],
    'chartDblClick': [{ type: Output },],
    'chartMouseDown': [{ type: Output },],
    'chartMouseUp': [{ type: Output },],
    'chartMouseOver': [{ type: Output },],
    'chartMouseOut': [{ type: Output },],
    'chartGlobalOut': [{ type: Output },],
    'chartContextMenu': [{ type: Output },],
    'chartDataZoom': [{ type: Output },],
    'chartLegendselectchanged': [{ type: Output },],
    'onWindowResize': [{ type: HostListener, args: ['window:resize', ['$event'],] },],
};

/**
 * Provide an wrapper for global echarts
 * ```typescript
 * export class AppComponent implements onInit {
 *   constructor(private nes: NgxEchartsService) {}
 *
 *   ngOnInit() {
 *     // const points = ...;
 *     // const rect = ...;
 *
 *     // Get native global echarts object, then call native function
 *     const echarts = this.nes.echarts;
 *     const points = echarts.graphic.clipPointsByRect(points, rect);
 *
 *     // Or call wrapper function directly:
 *     const points = this.nes.graphic.clipPointsByRect(points, rect);
 *   }
 * }
 * ```
 */
class NgxEchartsService {
    constructor() { }
    /**
     * Get global echarts object
     * @return {?}
     */
    get echarts() {
        return echarts;
    }
    /**
     * Wrapper for echarts.graphic
     * @return {?}
     */
    get graphic() {
        return this._checkEcharts() ? echarts.graphic : undefined;
    }
    /**
     * Wrapper for echarts.init
     * @return {?}
     */
    get init() {
        return this._checkEcharts() ? echarts.init : undefined;
    }
    /**
     * Wrapper for echarts.connect
     * @return {?}
     */
    get connect() {
        return this._checkEcharts() ? echarts.connect : undefined;
    }
    /**
     * Wrapper for echarts.disconnect
     * @return {?}
     */
    get disconnect() {
        return this._checkEcharts() ? echarts.disconnect : undefined;
    }
    /**
     * Wrapper for echarts.dispose
     * @return {?}
     */
    get dispose() {
        return this._checkEcharts() ? echarts.dispose : undefined;
    }
    /**
     * Wrapper for echarts.getInstanceByDom
     * @return {?}
     */
    get getInstanceByDom() {
        return this._checkEcharts() ? echarts.getInstanceByDom : undefined;
    }
    /**
     * Wrapper for echarts.registerMap
     * @return {?}
     */
    get registerMap() {
        return this._checkEcharts() ? echarts.registerMap : undefined;
    }
    /**
     * Wrapper for echarts.getMap
     * @return {?}
     */
    get getMap() {
        return this._checkEcharts() ? echarts.getMap : undefined;
    }
    /**
     * Wrapper for echarts.registerTheme
     * @return {?}
     */
    get registerTheme() {
        return this._checkEcharts() ? echarts.registerTheme : undefined;
    }
    /**
     * @return {?}
     */
    _checkEcharts() {
        if (echarts) {
            return true;
        }
        else {
            console.error('[ngx-echarts] global ECharts not loaded');
            return false;
        }
    }
}
NgxEchartsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgxEchartsService.ctorParameters = () => [];

class NgxEchartsModule {
}
NgxEchartsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    NgxEchartsDirective
                ],
                exports: [
                    NgxEchartsDirective
                ],
                providers: [
                    NgxEchartsService
                ]
            },] },
];
/**
 * @nocollapse
 */
NgxEchartsModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { NgxEchartsModule, NgxEchartsDirective, NgxEchartsService };
//# sourceMappingURL=ngx-echarts.js.map
