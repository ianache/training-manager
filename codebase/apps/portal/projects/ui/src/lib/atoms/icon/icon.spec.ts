import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfIcon } from './icon';

describe('GfIcon', () => {
  let component: GfIcon;
  let fixture: ComponentFixture<GfIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfIcon]
    }).compileComponents();
    fixture = TestBed.createComponent(GfIcon);
    component = fixture.componentInstance;
  });

  it('should render icon element', () => {
    component.name = 'check';
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon).toBeTruthy();
  });

  it('should add Material icon classes', () => {
    component.name = 'check';
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.classList.contains('material-icons')).toBe(true);
  });

  it('should have aria-hidden for decorative icons', () => {
    component.name = 'check';
    component.decorative = true;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
});
