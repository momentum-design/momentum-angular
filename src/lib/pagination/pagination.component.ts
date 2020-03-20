import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { PaginationService } from './pagination.service';
import { ENTER, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'md-pagination',
  template: `
    <md-pagination-arrow
      [isPrevious]='true'
      [ifPreventDefault]='ifPreventDefault'
    ></md-pagination-arrow>
    <md-pagination-number *ngFor='let item of renderGroupFirst'
      [index]='item'
      [ifPreventDefault]='ifPreventDefault'
    ></md-pagination-number>
    <li class='pagination_li ellipsis' *ngIf='firstGroupEnd > 0 && firstGroupEnd < midGroupStart - 1' aria-hidden="true">...</li>
    <md-pagination-number *ngFor='let item of renderGroupMid'
      [index]='item'
      [ifPreventDefault]='ifPreventDefault'
    ></md-pagination-number>
    <li class='pagination_li ellipsis' *ngIf='lastGroupStart <= total && lastGroupStart > midGroupEnd + 1' aria-hidden="true">...</li>
    <md-pagination-number *ngFor='let item of renderGroupLast'
      [index]='item'
      [ifPreventDefault]='ifPreventDefault'
    ></md-pagination-number>
    <md-pagination-arrow
      [isPrevious]='false'
      [ifPreventDefault]='ifPreventDefault'
    ></md-pagination-arrow>
  `,
  styleUrls: ['pagination.scss'],
  host: {
    class: 'pagination',
    'style': `
      display: block;
      min-height: 1.5rem;
      list-style-position: outside;
      clear:both;
    `,
    'attr.role': 'navigation',
    'attr.aria-label': 'Pagination',
    'tabindex': '0',
    '(keydown)': 'handleKeydown($event)'
  },
  providers: [PaginationService]
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {

  /** @option set the href format | '' */
  @Input() href: string = '';
  /** @option set the replace placeholder of href */
  @Input() hrefReplaceReg: string | RegExp = '$page$';
  /** @props set total | '' */
  @Input() total: number = 10;
  /** @props set current | '' */
  @Input() current: number = 1;
  /** @props set the first button group | '' */
  @Input() firstGroupNum: number = 2;
  /** @props set the mid button group | '' */
  @Input() midGroupNum: number = 3;
  /** @props set the last button group | '' */
  @Input() lastGroupNum: number = 2;
  /** @option Callback function invoked when user clicks buttons */
  @Output() whenClick = new EventEmitter();

  public renderGroupFirst = [];
  public renderGroupMid = [];
  public renderGroupLast = [];
  public renderGroup = [];

  public firstGroupEnd: number = -1;
  public midGroupStart: number = 1;
  public midGroupEnd: number = 1;
  public lastGroupStart: number = Infinity;

  public ifPreventDefault = false;

  private minCurrentForFirstGroup = 0;
  private maxCurrentForLastGroup = 0;

  private unsubscribe$ = new Subject();

  constructor(
    private paginationService: PaginationService
  ) { }

  ngOnInit() {
    const s = this.paginationService;
    s.initConfig(this.href, this.hrefReplaceReg, this.total);
    s.current$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((v) => {
      this.build();
      this.whenClick.emit(v);
    });
    this.paginationService.select(this.current);
    this.build();
  }

  ngOnChanges(changes: SimpleChanges) {
    let needsBuild = true;
    if (changes['total']) {
      needsBuild = changes['total'].currentValue >= this.paginationService.currentPage;
      this.paginationService.updateTotal(changes['total'].currentValue);
    }

    if (changes['current']) { // Will trigger a build
      this.paginationService.select(changes['current'].currentValue);
    } else if (needsBuild) {
        this.build();
    }

    this.paginationService.focus(this.paginationService.currentPage);
  }

  public handleKeydown = (event) => {
    const s = this.paginationService;
    let ifStop = false;

    switch (event.keyCode) {
      case LEFT_ARROW: // <-
        s.focusInList(this.renderGroup, -1);
        ifStop = true;
        break;
      case RIGHT_ARROW: // ->
        s.focusInList(this.renderGroup, 1);
        ifStop = true;
        break;
      case ENTER: // Enter
        s.selectfocus();
        ifStop = true;
        break;
      default:
        break;
    }
    if (ifStop) {
      event.stopPropagation();
    }
  }

  public build = () => {
    const s = this.paginationService,
      current = s.currentPage,
      total = s.totalPage,
      preMidLen = Math.floor((this.midGroupNum - 1) / 2),
      nextMidLen = this.midGroupNum - preMidLen - 1;
    this.minCurrentForFirstGroup = this.firstGroupNum + 1 + preMidLen; // > this
    this.maxCurrentForLastGroup = total - this.lastGroupNum - 1 - nextMidLen + 1; // > this

    if (current <= this.minCurrentForFirstGroup && current >= this.maxCurrentForLastGroup) { // merge all
      this.firstGroupEnd = -1;
      this.lastGroupStart = Infinity;
      this.midGroupStart = 1;
      this.midGroupEnd = total;
    } else {
      if (current > this.minCurrentForFirstGroup) {
        this.firstGroupEnd = this.firstGroupNum;
        this.midGroupStart = current - preMidLen;
        this.midGroupEnd = Math.min(total, this.midGroupStart + this.midGroupNum - 1);
      } else { // merge start and middle
        this.firstGroupEnd = -1;
        this.midGroupStart = 1;
        this.midGroupEnd = Math.min(total, Math.max(current + nextMidLen, this.minCurrentForFirstGroup));
      }

      if (current < this.maxCurrentForLastGroup) {
        this.lastGroupStart = total - this.lastGroupNum + 1;
      } else { // merge end and middle
        this.lastGroupStart = Infinity;
        this.midGroupStart = Math.max(1, Math.min(current - preMidLen, this.maxCurrentForLastGroup));
        this.midGroupEnd = total;
      }
    }

    // get template
    this.renderGroupFirst = [];
    this.renderGroupMid = [];
    this.renderGroupLast = [];
    this.renderGroup = [];
    let i = 1;

    if (current > 1) {
      this.renderGroup.push('previous');
    }

    for (i = 1; i <= this.firstGroupEnd; i++) {
      this.renderGroupFirst.push(i);
      this.renderGroup.push(i);
    }

    if (this.firstGroupEnd === this.midGroupStart) {
      this.renderGroupFirst.pop();
    }

    for (i = this.midGroupStart; i <= this.midGroupEnd; i++) {
      this.renderGroupMid.push(i);
      this.renderGroup.push(i);
    }

    if (this.midGroupEnd === this.lastGroupStart) {
      this.renderGroupMid.pop();
    }

    for (i = this.lastGroupStart; i <= total; i++) {
      this.renderGroupLast.push(i);
      this.renderGroup.push(i);
    }

    if (s.currentPage < total) {
      this.renderGroup.push('next');
    }
  }

  ngOnDestroy () {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
