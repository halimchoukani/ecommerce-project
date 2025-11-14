import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkout } from './checkout';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.shippingForm).toBeDefined();
    expect(component.paymentForm).toBeDefined();
  });

  it('should validate shipping form', () => {
    component.shippingForm.setValue({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
    });
    expect(component.shippingForm.valid).toBeFalsy();
  });
});
