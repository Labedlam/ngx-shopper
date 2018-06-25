import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmationComponent } from './order-confirmation.component';
import { ParamMap, ActivatedRoute, convertToParamMap } from '@angular/router';
import { OcLineItemService } from '@app/shared';
import { OrderService } from '@ordercloud/angular-sdk';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;

  const mockOrderID = 'MockGetOrder123';
  const appLineItemService = {
    listAll: jasmine.createSpy('listAll').and.returnValue(of(null)),
    getSupplierAddresses: jasmine.createSpy('getSupplierAddresses').and.returnValue(of(null))
  };
  const orderService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(null)),
    ListPromotions: jasmine.createSpy('List').and.returnValue(of(null))
  };
  const paramMap = new Subject<ParamMap>();

  const activatedRoute = {
    paramMap
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderConfirmationComponent,
      ],
      providers: [
        { provide: OcLineItemService, useValue: appLineItemService },
        { provide: OrderService, useValue: orderService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'getOrder');
      spyOn(component as any, 'getLineItems');
      spyOn(component as any, 'getPromotions');
      spyOn(component as any, 'getSupplierAddresses');
      component.ngOnInit();
    });
    it('should call getOrder', () => {
      expect(component['getOrder']).toHaveBeenCalled();
    });
    it('should call getLineItems', () => {
      expect(component['getLineItems']).toHaveBeenCalled();
    });
    it('should call getPromotions', () => {
      expect(component['getPromotions']).toHaveBeenCalled();
    });
    it('should call getSupplierAddresses', () => {
      expect(component['getSupplierAddresses']).toHaveBeenCalled();
    });
  });

  describe('getOrder', () => {
    it('should call OrderService.Get with order id param', () => {
      component['getOrder']().subscribe(() => {
        expect(orderService.Get).toHaveBeenCalledWith('outgoing', mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });

  describe('getLineItems', () => {
    it('should call OcLineItems.ListAll with order id param', () => {
      component['getLineItems']().subscribe(() => {
        expect(appLineItemService.listAll).toHaveBeenCalledWith(mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });

  describe('getPromotions', () => {
    it('should call OrderService.ListPromotions with order id param', () => {
      component['getPromotions']().subscribe(() => {
        expect(orderService.ListPromotions).toHaveBeenCalledWith('outgoing', mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });

  describe('getSupplierAddresses', () => {
    it('should call OcLineItemService.getSupplierAddresses', () => {
      component['getSupplierAddresses']().subscribe(() => {
        expect(appLineItemService.getSupplierAddresses).toHaveBeenCalled();
      });
    });
  });
});
