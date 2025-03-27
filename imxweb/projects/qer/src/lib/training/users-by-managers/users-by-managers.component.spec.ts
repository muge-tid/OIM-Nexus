import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersByManagersComponent } from './users-by-managers.component';

describe('UsersByManagersComponent', () => {
  let component: UsersByManagersComponent;
  let fixture: ComponentFixture<UsersByManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersByManagersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersByManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
