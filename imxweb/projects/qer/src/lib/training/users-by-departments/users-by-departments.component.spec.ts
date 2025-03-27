import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersByDepartmentsComponent } from './users-by-departments.component';

describe('UsersByDepartmentsComponent', () => {
  let component: UsersByDepartmentsComponent;
  let fixture: ComponentFixture<UsersByDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersByDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersByDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
