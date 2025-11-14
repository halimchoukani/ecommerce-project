import { TestBed } from '@angular/core/testing';
import { Profile } from './profile';

describe('Profile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Profile);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize with orders tab active', () => {
    const fixture = TestBed.createComponent(Profile);
    const component = fixture.componentInstance;
    expect(component.activeTab).toBe('orders');
  });

  it('should initialize profile form', () => {
    const fixture = TestBed.createComponent(Profile);
    const component = fixture.componentInstance;
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('username')).toBeDefined();
    expect(component.profileForm.get('email')).toBeDefined();
  });
});
